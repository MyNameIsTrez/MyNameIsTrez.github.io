---
layout: post
title: "Comptime C functions"
date: 2025-11-30 12:00:00 +0100
---

Compile-time function execution is great, but what if:
1. You're stuck with C.
2. You don't want to use evil C macros, which are debugging nightmares.
3. You want generic data structures that work for all types.

The below data structure showcase programs get optimized away at compile time by Clang and GCC:
```nasm
fn_version:
        ret

macro_version:
        ret
```

Here is how it is achieved in C:
- `static inline` allows inlining across compilation boundaries.
- `__attribute__((always_inline))` *strongly* urges compilers to inline functions.
- `__builtin_unreachable()` is used to teach the optimizer which assumptions it can make about input arguments.
- Passing `-O3` to the compiler tells it to optimize the code very hard.
- Passing `-march=native` to the compiler tells it to make optimizations based on your specific CPU.
- Constant buffer addresses + sizes let the optimizer trace through `memcpy()` calls.
- All operations become statically analyzable, reducing to constants.
- `assert()` calls get eliminated when conditions are provably true.

It's not actually "stack vs heap" that matters; what matters is whether the compiler can treat the buffer as a non-escaping, fully analyzable region of memory. Stack allocation makes that easy. Heap allocation only works in very simple cases where the pointer never escapes and all memory operations can be folded away.

The only legitimate use-case I can think of for this technique is generating lookup tables at compile-time, since functions like `sin()` *also* successfully get optimized away.

[Link-time optimization](https://en.wikipedia.org/wiki/Interprocedural_optimization) with `-flto` should allow Clang and GCC to perform these optimizations even when the code is split across several object files.

# Generic Stack

Copy of the code on [Compiler Explorer](https://godbolt.org/z/h9narbMG8):

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

__attribute__((always_inline))
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
    // assert() isn't aggressive enough
    if (n < 2) __builtin_unreachable();

    Pair *buffer = malloc(n * sizeof(*buffer));

    stack s;
    stack_init(&s, buffer, sizeof(Pair), n);

    Pair p1 = {.a = 10, .b = 20};
    Pair p2 = {.a = 111, .b = sin(222.0)};

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
    // assert() isn't aggressive enough
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
```

# Generic Hash Map

Copy of the code on [Compiler Explorer](https://godbolt.org/z/d176e16eb):

```c
#include <assert.h>
#include <stdbool.h>
#include <math.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>

typedef struct {
    bool occupied;
    unsigned char key_value[]; // C99 flexible array member
} entry;

typedef struct {
    void *entries;
    size_t capacity, key_size, value_size, entry_size;
} hashmap;

__attribute__((always_inline))
static inline void hashmap_init(hashmap *m, void *buf, size_t ks, size_t vs, size_t cap) {
    m->entries = buf;
    m->capacity = cap;
    m->key_size = ks;
    m->value_size = vs;
    m->entry_size = sizeof(entry) + ks + vs;
    memset(buf, 0, cap * m->entry_size);
}

// Naive hashing
__attribute__((always_inline))
static inline size_t hash(const void *key, size_t size) {
    size_t h = 0;
    for (size_t i = 0; i < size; i++)
        h = h * 31 + ((unsigned char*)key)[i];
    return h;
}

__attribute__((always_inline))
static inline void hashmap_insert(hashmap *m, const void *key, const void *val) {
    size_t idx = hash(key, m->key_size) % m->capacity;
    for (size_t i = 0; i < m->capacity; i++) {
        entry *e = (entry*)((unsigned char*)m->entries + ((idx + i) % m->capacity) * m->entry_size);
        if (!e->occupied || memcmp(e->key_value, key, m->key_size) == 0) {
            e->occupied = true;
            memcpy(e->key_value, key, m->key_size);
            memcpy(e->key_value + m->key_size, val, m->value_size);
            return;
        }
    }
}

__attribute__((always_inline))
static inline bool hashmap_get(hashmap *m, const void *key, void *out) {
    size_t idx = hash(key, m->key_size) % m->capacity;
    for (size_t i = 0; i < m->capacity; i++) {
        entry *e = (entry*)((unsigned char*)m->entries + ((idx + i) % m->capacity) * m->entry_size);
        if (!e->occupied) return false;
        if (memcmp(e->key_value, key, m->key_size) == 0) {
            memcpy(out, e->key_value + m->key_size, m->value_size);
            return true;
        }
    }
    return false;
}

// Entry of (int, char*) map
typedef struct {
    bool occupied;
    int key;
    char *value;
} IntStrMap_entry;

// Entry of (int, double) map
typedef struct {
    bool occupied;
    int key;
    double value;
} IntDblMap_entry;

int main(void) {
    // Test (int, char*) map
    IntStrMap_entry buf1[8] = {0};
    hashmap m1;
    hashmap_init(&m1, buf1, sizeof(int), sizeof(char*), 8);
    
    int k1 = 42;
    char *v1 = "foo";
    hashmap_insert(&m1, &k1, &v1);
    
    int k2 = 7;
    char *v2 = "bar";
    hashmap_insert(&m1, &k2, &v2);
    
    char *r1;
    hashmap_get(&m1, &k1, &r1);
    char *r2;
    hashmap_get(&m1, &k2, &r2);

    assert(strcmp(r1, "foo") == 0);
    assert(strcmp(r2, "bar") == 0);
    
    // Test (int, double) map
    IntDblMap_entry buf2[8] = {0};
    hashmap m2;
    hashmap_init(&m2, buf2, sizeof(int), sizeof(double), 8);
    
    int k3 = 10;
    double v3 = 3.14159;
    hashmap_insert(&m2, &k3, &v3);
    
    int k4 = 20;
    double v4 = 2.71828;
    hashmap_insert(&m2, &k4, &v4);
    
    double d1;
    hashmap_get(&m2, &k3, &d1);
    double d2;
    hashmap_get(&m2, &k4, &d2);

    assert(fabs(d1 - 3.14159) < 0.00001);
    assert(fabs(d2 - 2.71828) < 0.00001);
    
    printf("Hash map test passed.\n");
}
```
