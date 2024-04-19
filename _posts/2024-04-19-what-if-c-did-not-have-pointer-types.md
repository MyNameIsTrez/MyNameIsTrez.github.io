---
layout: post
title: "What if C did not have pointer types"
date: 2024-04-19 06:00:00 +0100
---

I think it helps to know that Ken Thompson and Dennis Ritchie first created the B programming language, and then turned that into C.

From B [its Wikipedia article](https://en.wikipedia.org/wiki/B_(programming_language)):
> a typeless language, with the only data type being the underlying machine's natural memory word format, whatever that might be. Depending on the context, the word was treated either as an integer or a memory address.

So B also had pointers, but they were distinguishable from regular ints, similar to how the Assembly that C compiles to doesn't have a concept of variable types.

So although one starts off learning pointers in C by constantly fighting the compiler, the pointer types are just there so that the compiler can verify that your code isn't moronic. If it didn't do this, like the B compiler, your program would be way more likely to randomly crash at runtime.

Taking your original block of code, I've turned the pointer in `void by_pointer(int *x) {` into and int with `void by_pointer(int x) {`. This would pretty much work, if the C compiler didn't check types, and if an int used as many bytes as a pointer:
```c
#include <stdio.h>

void by_value(int x) {
    x += 1;
}

void by_pointer(int x) {
    *x += 1;
}

int main(void) {
    int x = 68;
    
    by_value(x);
    printf("%d\n", x);
    
    by_pointer(&x);
    printf("%d\n", x);
}
```

The problem is that if you were to change `by_pointer(&x);` to `by_pointer(x);`, the compiler would have no way to tell that is wrong, since both `&x` and `x` would be an int. So then your `by_pointer` function would be dereferencing the value of 68 with its `*x += 1;` and would crash, as 68 wouldn't be a valid address.
