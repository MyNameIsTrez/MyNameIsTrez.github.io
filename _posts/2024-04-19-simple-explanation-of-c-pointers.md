---
layout: post
title: "Simple explanation of C pointers"
date: 2024-04-19 06:00:00 +0100
---

In the [Together C & C++ Discord server](https://discord.gg/tccpp) Qylo posted this block of code, and asked why the first `printf()` call prints 68, instead of 69:

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

The explanation is that in C, whenever you pass something as a function call argument, it is always passed by value, so never by reference.

What this means for this block of code is that when `by_value(x);` in `main()` gets executed, the `by_value()` function is entered, and its `int x` argument is initialized to a value of 68. What's important here is that the `x` variable in `by_value()` and the one in `main()` are completely separate. This means that changing the value of the `x` in `by_value()` doesn't change the value of the `x` in `main()`. So when this program is executed, the `x` in `by_value` gets incremented to 69, but the `x` in `main()` stays 68. This is analogous to how two people with the same first name aren't necessarily the same age.

But this didn't really go into how one *does* pass `x` to a function, in a way that the function can change the value of the `x` in `main()`.

The below solution works, but doesn't qualify, as `by_return()` isn't *really* changing the value of `x` in `main()`. Instead, it requires the *caller* of `by_return()` to assign the returned value back to `x`:

```c
#include <stdio.h>

int by_return(int x) {
    return x + 1;
}

int main(void) {
    int x = 68;
    x = by_return(x);
    printf("%d\n", x); // Prints 69
}
```

`by_value(x);` passes the value 68, whereas `by_pointer(&x);` passes a value like 0x12345678. Both are just integer values.

Another question that one might ask is why we do `by_pointer(&x);`, instead of `by_pointer(x);`. The C compiler can see that we're calling a function that expects an argument with type `int *x` after all, so couldn't it just turn it into `by_pointer(&x);` for us? The simple answer is that the compiler doesn't want to do this for you. So what'd instead end up happening is that 68 would be passed, which is an invalid address, and your program would crash at runtime when it tries to dereference it with `*x += 1;` in `by_pointer()`. But although the C compiler chooses to never automatically take stuff by reference for us, it at least doesn't let `by_pointer(x);` compile, as it can see that we're passing an `int` to a function that expects `int *x`.

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
