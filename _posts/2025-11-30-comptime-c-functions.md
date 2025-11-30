---
layout: post
title: "Comptime C functions"
date: 2025-11-30 12:00:00 +0100
---

Compile-time function execution is great, as it means your program has to run less code at runtime, but what if:
1. You're stuck with C.
2. You don't want to use evil C macros, as they are debugging nightmares.
3. You want generic data structures that work for all types, and that can use `malloc()` and `free()` internally.

This blog post shows programs where data structures get completely optimized away at compile time by Clang and GCC, using [constant folding](https://en.wikipedia.org/wiki/Constant_folding), [inlining](https://en.wikipedia.org/wiki/Inline_expansion), and [dead code elimination](https://en.wikipedia.org/wiki/Dead-code_elimination). Here is the x86-64 Assembly that their functions get optimized down to:
```nasm
fn_version: ; label for the fn_version() function
    ret ; return statement

macro_version:
    ret
```

The best use-case I can think of for this technique is generating lookup tables at compile-time, as math functions like `sin()` *also* get optimized away.

Embedded systems with tight runtime constraints, and zero-cost abstraction C libraries could also use this technique, but **they typically don't want to rely too heavily on the optimizer's cleverness**.

[Link-time optimization](https://en.wikipedia.org/wiki/Interprocedural_optimization) with `-flto` should allow Clang and GCC to perform these optimizations even when the code is split across several object files.

# Generic stack

I added a `main()` function to the below program, to prove that it doesn't crash on any `assert()` calls at runtime. It's important to note that the `fn_version()` and `macro_version()` functions get optimized just as hard, even when you remove the `main()`.

Here are the used optimization flags:
- Passing `-O3` to the compiler tells it to optimize the code very hard.
- Passing `-march=native` to the compiler tells it to make optimizations based on your specific CPU.

Copy of the code on [Compiler Explorer](https://godbolt.org/z/33Tzh5hKo):

```c
#include <assert.h>
#include <math.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum ErrorCode {
    SUCCESS = 0,
    STACK_FULL = -1,
    STACK_EMPTY = -2,
} ErrorCode;

typedef struct stack {
    void *data;
    size_t size;
    size_t capacity;
    size_t element_size;
} stack;

__attribute__((always_inline)) // Strongly urges compilers to inline functions
static inline void stack_init(stack *s, void *buffer, size_t element_size, size_t capacity) {
    s->data = buffer;
    s->size = 0;
    s->capacity = capacity;
    s->element_size = element_size;
}

__attribute__((always_inline))
static inline ErrorCode stack_push(stack *s, const void *element) {
    if (s->size >= s->capacity) {
        return STACK_FULL;
    }
    // This memcpy() is like assigning a value of *any* type using the = operator
    memcpy((unsigned char *)s->data + s->size * s->element_size,
           element, s->element_size);
    s->size++;
    return SUCCESS;
}

__attribute__((always_inline))
static inline ErrorCode stack_pop(stack *s, void *out) {
    if (s->size == 0) {
        return STACK_EMPTY;
    }
    s->size--;
    memcpy(out,
           (unsigned char *)s->data + s->size * s->element_size,
           s->element_size);
    return SUCCESS;
}

__attribute__((always_inline))
static inline bool stack_empty(const stack *s) {
    return s->size == 0;
}

typedef struct {
    uint32_t a;
    double b;
} Pair;

void fn_version(size_t n) {
    // __builtin_unreachable() tells the optimizer which assumptions it can safely make
    // assert() isn't aggressive enough
    if (n < 2) __builtin_unreachable();

    Pair *buffer = malloc(n * sizeof(*buffer));

    stack s;
    stack_init(&s, buffer, sizeof(Pair), n);

    Pair p1 = {.a = 10, .b = 20};
    Pair p2 = {.a = 111, .b = sin(222.0)}; // sin() is optimized away!

    // assert()s get optimized away when they are provably correct at compile time
    assert(stack_push(&s, &p1) == SUCCESS);
    assert(stack_push(&s, &p2) == SUCCESS);

    Pair out2;
    assert(stack_pop(&s, &out2) == SUCCESS);
    assert(out2.a == 111 && out2.b == sin(222.0));

    Pair out1;
    assert(stack_pop(&s, &out1) == SUCCESS);
    assert(out1.a == 10 && out1.b == 20.0);

    assert(stack_empty(&s));
}

#define STACK_PUSH(s, value)                                                     \
    do {                                                                         \
        if ((s)->size >= (s)->capacity) {                                        \
            return;                                                   \
        }                                                                        \
        /* Byte-copy using macro, no memcpy() */                                   \
        unsigned char *dst =                                                     \
            (unsigned char *)(s)->data + (s)->size * (s)->element_size;          \
        const unsigned char *src = (const unsigned char *)&(value);              \
        for (size_t i = 0; i < (s)->element_size; ++i)                           \
            dst[i] = src[i];                                                     \
        (s)->size++;                                                             \
    } while (0)

#define STACK_POP(s, out_lvalue)                                                 \
    do {                                                                         \
        if ((s)->size == 0) {                                                    \
            return;                                                  \
        }                                                                        \
        (s)->size--;                                                             \
        unsigned char *dst = (unsigned char *)&(out_lvalue);                     \
        const unsigned char *src =                                               \
            (const unsigned char *)(s)->data + (s)->size * (s)->element_size;    \
        for (size_t i = 0; i < (s)->element_size; ++i)                           \
            dst[i] = src[i];                                                     \
    } while (0)


void macro_version(size_t n) {
    if (n < 2) __builtin_unreachable();

    Pair *buffer = malloc(n * sizeof(*buffer));

    stack s;
    stack_init(&s, buffer, sizeof(Pair), n);

    Pair p1 = {.a = 10, .b = 20};
    Pair p2 = {.a = 111, .b = sin(222.0)};

    STACK_PUSH(&s, p1);
    STACK_PUSH(&s, p2);

    Pair out2;
    STACK_POP(&s, out2);
    assert(out2.a == 111 && out2.b == sin(222.0));

    Pair out1;
    STACK_POP(&s, out1);
    assert(out1.a == 10 && out1.b == 20.0);

    assert(stack_empty(&s));
}

int main() {
    fn_version(2);
    macro_version(2);
}
```

# Generic hash map

Because a hash map is a much more complex data structure than a stack, GCC struggles to optimize it perfectly, even with macros and extra flags:
- `-finline-limit=999999`
- `--param max-inline-insns-single=999999`
- `--param max-inline-insns-auto=999999`

GCC still keeps the `calloc()` and `free()` calls around:
```nasm
main:
    sub     rsp, 8
    mov     esi, 13
    mov     edi, 2
    call    "calloc"
    mov     QWORD PTR [rax+5], OFFSET FLAT:.LC0
    mov     rdi, rax
    call    "free"
    mov     edi, OFFSET FLAT:.LC1
    call    "puts" ; printf() got translated to the faster puts()
    xor     eax, eax
    add     rsp, 8
    ret
```

But GCC manages to optimize them away when the `printf("All tests passed.\n");` at the end of `main()` is removed, for some unknown reason.

Clang on the other hand manages to completely optimize the below macro-based hash map away, which isn't surprising, given that Clang generally generates more optimized Assembly than GCC.

Copy of the code on [Compiler Explorer](https://godbolt.org/z/eecK3rK7z):

```c
#include <stdbool.h>
#include <math.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    bool occupied;
    // key and value are stored inline in memory after `occupied`
} entry;

typedef struct {
    void *entries;
    size_t capacity, key_size, value_size, entry_size;
} hashmap;

__attribute__((always_inline))
static inline void hashmap_init(hashmap *m, void *buf, size_t ks, size_t vs, size_t capacity) {
    m->entries = buf;
    m->capacity = capacity;
    m->key_size = ks;
    m->value_size = vs;
    m->entry_size = sizeof(bool) + ks + vs;
    memset(buf, 0, capacity * m->entry_size);
}

// Naive hashing
__attribute__((always_inline))
static inline size_t hash(const void *key, size_t size) {
    return 42;
}

// Macro versions (no memcpy, no memcmp)
#define HASHMAP_INSERT(m, key_val, value_val)                                    \
    do {                                                                         \
        size_t idx = hash(&(key_val), (m)->key_size) % (m)->capacity;           \
        for (size_t i = 0; i < (m)->capacity; i++) {                             \
            unsigned char *e_ptr = (unsigned char*)(m)->entries +                \
                                   ((idx + i) % (m)->capacity) * (m)->entry_size; \
            bool *occupied = (bool*)e_ptr;                                       \
            unsigned char *kv = e_ptr + sizeof(bool);                             \
            bool keys_match = true;                                              \
            if (*occupied) {                                                     \
                const unsigned char *key_ptr = (unsigned char*)&(key_val);       \
                for (size_t j = 0; j < (m)->key_size; j++) {                     \
                    if (kv[j] != key_ptr[j]) {                                   \
                        keys_match = false;                                      \
                        break;                                                   \
                    }                                                            \
                }                                                                \
            }                                                                    \
            if (!*occupied || keys_match) {                                      \
                *occupied = true;                                                \
                const unsigned char *src_key = (unsigned char*)&(key_val);       \
                const unsigned char *src_val = (unsigned char*)&(value_val);    \
                for (size_t j = 0; j < (m)->key_size; j++) kv[j] = src_key[j];   \
                for (size_t j = 0; j < (m)->value_size; j++)                     \
                    kv[(m)->key_size + j] = src_val[j];                          \
                break;                                                           \
            }                                                                    \
        }                                                                        \
    } while (0)

#define HASHMAP_GET(m, key_val, out_lvalue)                                      \
    do {                                                                         \
        size_t idx = hash(&(key_val), (m)->key_size) % (m)->capacity;           \
        for (size_t i = 0; i < (m)->capacity; i++) {                             \
            unsigned char *e_ptr = (unsigned char*)(m)->entries +                \
                                   ((idx + i) % (m)->capacity) * (m)->entry_size; \
            bool *occupied = (bool*)e_ptr;                                       \
            unsigned char *kv = e_ptr + sizeof(bool);                             \
            if (!*occupied) break;                                               \
            bool keys_match = true;                                              \
            const unsigned char *key_ptr = (unsigned char*)&(key_val);           \
            for (size_t j = 0; j < (m)->key_size; j++) {                         \
                if (kv[j] != key_ptr[j]) {                                       \
                    keys_match = false;                                          \
                    break;                                                       \
                }                                                                \
            }                                                                    \
            if (keys_match) {                                                    \
                unsigned char *dst = (unsigned char*)&(out_lvalue);              \
                for (size_t j = 0; j < (m)->value_size; j++)                     \
                    dst[j] = kv[(m)->key_size + j];                               \
                break;                                                           \
            }                                                                    \
        }                                                                        \
    } while (0)

__attribute__((always_inline))
static inline void macro_version(size_t capacity) {
    // (int, char*) map
    size_t entry_size1 = sizeof(bool) + sizeof(int) + sizeof(char*);

    unsigned char *buf1 = calloc(capacity, entry_size1);
    if (buf1 == NULL) __builtin_unreachable();

    hashmap m1;
    hashmap_init(&m1, buf1, sizeof(int), sizeof(char*), capacity);

    int k1 = 42; char *v1 = "foo";
    HASHMAP_INSERT(&m1, k1, v1);

    char *r1; HASHMAP_GET(&m1, k1, r1);
    if (strcmp(r1, "foo") != 0) __builtin_unreachable();

    free(buf1);
}

int main() {
    size_t capacity = 2;
    macro_version(capacity);
    printf("All tests passed.\n");
}
```
