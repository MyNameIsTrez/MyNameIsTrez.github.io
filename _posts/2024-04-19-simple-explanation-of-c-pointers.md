---
layout: post
title: "Simple explanation of C pointers"
date: 2024-04-19 06:00:00 +0100
---

In the [Together C & C++ Discord server](https://discord.gg/tccpp) Qylo posted a block of code similar to the below one, and asked why the first `printf()` call prints 68, instead of 69:

```c
#include <stdio.h>

void by_value(int x) {
    x = x + 1;
}

void by_pointer(int *x) {
    *x = *x + 1;
}

int main(void) {
    int x = 68;
    
    by_value(x);
    printf("%d\n", x); // Prints 68
    
    by_pointer(&x);
    printf("%d\n", x); // Prints 69
}
```

When `by_value(x);` in `main()` gets executed, the `by_value()` function is entered, and its `int x` argument variable has its value initialized to 68. What's important here is that the `x` variable in `by_value()` and the one in `main()` are completely separate. This means that changing the value of the `x` in `by_value()` doesn't change the value of the `x` in `main()`. So when this program is executed, the `x` in `by_value` gets incremented to 69, but the `x` in `main()` stays 68. Just because two guys are called Bob doesn't necessarily mean they are the same age, right?

So when someone says that arguments passed to a function in C are always passed by value, this is what they're referring to. If C were to secretly let the `int x` argument of `by_value()` modify the `x` from `main()`, then arguments in C would be passed by reference (reference as in "refer to this other thing").

Okay, so how *can* one let a function modify the `x` from `main()`?

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

This one works and qualifies, as `by_pointer()` is truly changing the value of `x` in `main()`:

```c
#include <stdio.h>

void by_pointer(int *x) {
    *x = *x + 1;
}

int main(void) {
    int x = 68;
    by_pointer(&x);
    printf("%d\n", x); // Prints 69
}
```

So how does it work?

1. Whereas `by_value(x);` passes the value 68, `by_pointer(&x);` passes a value like 12345678. The exact value is unpredictable, as it depends on where the operating system felt like storing the `x` variable in memory.
2. When 12345678 is passed into `by_pointer()`, the `int *x` argument gets initialized to 12345678. You can just ignore the `*` in `int *x` for the time being, so just think of it as initializing an `int` called `x` with the value 12345678.
3. The function then executes `*x = *x + 1;`. In C, everything to the right of the assignment operator gets executed first, so the `*x` in `*x + 1` gets executed first. This looks at the value stored in `x`, which is 12345678, and then jumps to the byte at that memory address.
4. Once it has landed there, it reads several bytes. How many bytes it reads depends on what it expects to find there, which is an `int` in this case. Since `sizeof(int)` returns 4 on my computer, it reads the four bytes at addresses 12345678, 12345679, 12345680, and 12345681. Since the value of `x` in `main()` is 68, and we are reading the bytes at its address, we know that the four bytes read together must form the `int` 68.
5. We now have `*x = 68 + 1;`, which turns into `*x = 69;`. Now that the right side of the assignment operator has been fully evaluated, the `*x` on the left gets executed. This again jumps to address 12345678, but this time splits the `69` into four bytes, and then writes them to 12345678, 12345679, 12345680, and 12345681.
6. The `by_pointer()` function returns, and `printf("%d\n", x);` gets executed. The `x` here also refers to the bytes at addresses 12345678, 12345679, 12345680, and 12345681, which is why 69 gets printed.

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
