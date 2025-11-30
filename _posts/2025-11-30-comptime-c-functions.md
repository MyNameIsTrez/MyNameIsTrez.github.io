---
layout: post
title: "Comptime C functions"
date: 2025-11-29 12:00:00 +0100
---

Compile-time function execution is great, but what if:
1. You're stuck with C.
2. You don't want to use evil C macros.
3. You want generic data structures that work for all types.

The below data structure showcase programs get optimized away at compile time by GCC and Clang, such that only the `printf()` at the end of `main()` is left:
```nasm
main:
    push    rax
    lea     rdi, [rip + .Lstr]
    call    puts@PLT ; printf() got translated to the faster puts()
    xor     eax, eax
    pop     rcx
    ret
```

Here is how it is achieved in C:
- `static inline` allows inlining across compilation boundaries.
- `__attribute__((always_inline))` forces the compiler to inline functions.
- Constant buffer addresses + sizes let the optimizer trace through `memcpy()` calls.
- All operations become statically analyzable, reducing to constants.
- `assert()` calls get eliminated when conditions are provably true.

[Link-time optimization](https://en.wikipedia.org/wiki/Interprocedural_optimization) with `-flto` should allow GCC and Clang to perform these optimizations even when the code is split across several object files.

# Generic Stack

GCC requires `-O1`, while Clang requires `-O2`.

Copy of the code on [Compiler Explorer](https://godbolt.org/z/sGos8zvzE):

```c
#include <assert.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
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

static inline void stack_init(stack *s, void *buffer, size_t element_size, size_t capacity) {
    s->data = buffer;
    s->size = 0;
    s->capacity = capacity;
    s->element_size = element_size;
}

static inline ErrorCode stack_push(stack *s, const void *element) {
    if (s->size >= s->capacity) {
        return STACK_FULL;
    }
    // This memcpy() is like assigning a value of *any* type using the = operator
    memcpy((unsigned char *)s->data + s->size * s->element_size, element, s->element_size);
    s->size++;
    return SUCCESS;
}

static inline ErrorCode stack_pop(stack *s, void *out) {
    if (s->size == 0) {
        return STACK_EMPTY;
    }
    s->size--;
    memcpy(out, (unsigned char *)s->data + s->size * s->element_size, s->element_size);
    return SUCCESS;
}

static inline bool stack_empty(const stack *s) {
    return s->size == 0;
}

typedef struct {
    uint32_t a;
    double b;
} Pair;

int main(void) {
    Pair buffer[100];
    stack s;
    stack_init(&s, buffer, sizeof(Pair), 100);

    Pair p1 = {.a = 10, .b = 20};
    Pair p2 = {.a = 111, .b = 222.0};

    assert(stack_push(&s, &p1) == SUCCESS);
    assert(stack_push(&s, &p2) == SUCCESS);

    Pair out2;
    assert(stack_pop(&s, &out2) == SUCCESS);
    assert(out2.a == 111 && out2.b == 222.0);

    Pair out1;
    assert(stack_pop(&s, &out1) == SUCCESS);
    assert(out1.a == 10 && out1.b == 20.0);

    assert(stack_empty(&s));

    printf("Stack test passed.\n");
}
```

# Generic Hash Map

GCC requires `__attribute__((always_inline))` above `hashmap_insert()` *or* `hashmap_get()`, while Clang does not require it.

GCC requires `-O2`, while Clang requires `-O3`.

Copy of the code on [Compiler Explorer](https://godbolt.org/z/16xhne83s):

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

static inline void hashmap_init(hashmap *m, void *buf, size_t ks, size_t vs, size_t cap) {
    m->entries = buf;
    m->capacity = cap;
    m->key_size = ks;
    m->value_size = vs;
    m->entry_size = sizeof(entry) + ks + vs;
    memset(buf, 0, cap * m->entry_size);
}

// Naive hashing
static inline size_t hash(const void *key, size_t size) {
    size_t h = 0;
    for (size_t i = 0; i < size; i++)
        h = h * 31 + ((unsigned char*)key)[i];
    return h;
}

__attribute__((always_inline)) // Necessary for GCC, not Clang
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

// Type-safe wrapper for (int, char*) map
typedef struct {
    bool occupied;
    int key;
    char *value;
} IntStrMap_entry;

// Type-safe wrapper for (int, double) map
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
