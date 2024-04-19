---
layout: post
title: "What if C did not have pointer types"
date: 2024-04-19 06:00:00 +0100
---

In the [Together C & C++ Discord server](https://discord.gg/tccpp) Qylo posted this snippet of code, and asked why the first printf statement prints 68, instead of 69:

```c
#include <stdio.h>

void by_value(int x) {
    x += 1;
}

void by_pointer(int *x) {
    *x += 1;
}

int main(void) {
    int x = 68;
    
    by_value(x);
    printf("%d\n", x); // Prints 68
    
    by_pointer(&x);
    printf("%d\n", x); // Prints 69
}
```

The common explanation is that whenever you pass something as an argument into a function call, the argument is always passed by value in C. What this means is that in `by_value(x);` the value 68 is passed, whereas in `by_pointer(&x);` a value like 0x12345678 is passed in. So although one might think that `by_pointer(x);` is valid, because C could take the address of `x` here as it can see that the function expects `int *x`, it doesn't do this automatically. What'd actually end up happening is that it'd just pass the value 68 into the function, rather than the address of it.

But this doesn't really explain *why* C has pointer types in the first place. For this, it helps to know that Ken Thompson and Dennis Ritchie first created [the B programming language](https://en.wikipedia.org/wiki/B_(programming_language)), and then turned that into C:
> a typeless language, with the only data type being the underlying machine's natural memory word format, whatever that might be. Depending on the context, the word was treated either as an integer or a memory address.

So B also had pointers in a sense, but they were indistinguishable from regular ints. So B is similar to the Assembly that C compiles, in the sense that both don't have a concept of variable types.

Although it often feels like pointers are annoying when one starts out programming in C, the pointer types are there so that the compiler can catch that you're trying to jump to an invalid address like 68. If it were more similar to the B compiler then it wouldn't do this check, causing your program to crash at runtime once it tries to read from or write to address 68.

Taking the original block of code, I've turned the pointer in `void by_pointer(int *x) {` into and int with `void by_pointer(int x) {`. This would still work, if the C compiler only had an int type, and an int used the same number of bytes as a pointer:
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
    printf("%d\n", x); // Prints 68
    
    by_pointer(&x);
    printf("%d\n", x); // Prints 69
}
```

The problem is that if you were to change `by_pointer(&x);` to `by_pointer(x);`, the compiler would have no way to tell that is wrong, since both `&x` and `x` would be an int. So then the `by_pointer` function would be dereferencing the value of 68 with its `*x += 1;` and would crash, as 68 wouldn't be a valid address.
