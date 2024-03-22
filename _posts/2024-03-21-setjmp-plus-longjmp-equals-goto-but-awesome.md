---
layout: post
title: "setjmp + longjmp = goto but awesome"
date: 2024-03-21 12:00:00 +0100
---

# The problem

If you've ever written a large C program before, you will have encountered the issue of error handling.

I am implementing [grug]({{ site.baseurl }} {% link _posts/2024-02-29-creating-the-perfect-modding-language.md %}) in C right now, and so far I have just printed the error and exited the program whenever an error was encountered.

Here is a snippet from grug's tokenizer. The if-statement is necessary to prevent `tokens.tokens[token_index]` from segfaulting the entire game whenever a mod has a typo in it:

```c
static token get_token(size_t token_index) {
    if (token_index >= tokens.size) {
        fprintf(stderr, "token_index %zu was out of bounds in get_token()\n", token_index);
        exit(EXIT_FAILURE);
    }
    return tokens.tokens[token_index];
}
```

There are two big problems with this approach:
1. Games want to be able to present the error message to the user through say an in-game console
2. Exiting a game gracefully rather than because of a segfault isn't much better whenever a mod has a typo in it, especially since mods are hot reloadable, so can be edited during gameplay

If grug had been written in C++ throwing an exception here would have addressed both of these issues, but I don't want the baggage that C++ brings in several aspects.

I love Zig's elegant [error union type](https://ziglang.org/documentation/master/#Error-Union-Type) that compared to C++ forces the programmer to mark which functions can and can't throw, and forces the programmer to call such functions with the `try` keyword. The only reason I didn't write grug in Zig is because I don't want to scare people away by having the code be in a language they don't know or aren't comfortable editing. Way more people know C than Zig right now, unfortunately. (And yes, I know I am contributing to the problem by not writing it in Zig, sue me!)

# My initial solution

In order to address the two problems, I added these global variables:

```c
char error_msg[420];
bool error_happened = false;
```

Which are used to print the message to a buffer, and to remember that something went wrong, like so:

```c
static token get_token(size_t token_index) {
    if (token_index >= tokens.size) {
        snprintf(error_msg, sizeof(error_msg), "token_index %zu was out of bounds in get_token()", token_index);
        error_happened = true;
        return;
    }
    return tokens.tokens[token_index];
}
```

But now that the program doesn't immediately exit on error, `if (error_happened) return;` has to pasted after every single call that can directly or indirectly(!) throw an error:

```c
token token = get_token(i);
if (error_happened) return;
char *token_type_str = get_token_type_str[token.type];
```

This isn't a huge issue, but it's extremely hard to tell where I forgot to paste it. If I had forgotten to paste it in the above code block, `token.type` would have had an undefined value, and would've caused a segfault when it gets used as an index into an array at `get_token_type_str[token.type]`.

# goto?

Ideally there'd be some way of replicating C++ or Zig's exception bubbling, so that I wouldn't have to paste `if (error_happened) return;` anywhere.

Maybe the `get_token()` function from the previous code blocks could use `goto` to jump to jump all the way back up to an error handling routine?

![image](https://github.com/MyNameIsTrez/MyNameIsTrez.github.io/assets/32989873/c7b2ca54-2135-48b1-b294-b35cb59fc097)

*You didn't think I'd let this opportunity to reference [xkcd 292](https://xkcd.com/292/) slide, right?*

Unfortunately, the C Language Standard [says](https://stackoverflow.com/a/17357266) you aren't allowed to do that:

> The identifier in a goto statement shall name a label located somewhere ***in the enclosing function***. A goto statement shall not jump from outside the scope of an identifier having a variably modified type to inside the scope of that identifier.

If only there was some alternative to `goto` in C that allowed you to jump back up the call stack...

# setjmp + longjmp

For a change, the [man page](https://man7.org/linux/man-pages/man3/longjmp.3.html) gives a solid description of these functions on the very first line:

> The functions described on this page are used for performing "nonlocal gotos": transferring execution from one function to a predetermined location in another function. The setjmp() function dynamically establishes the target to which control will later be transferred, and longjmp() performs the transfer of execution.

This wouldn't be C if there wasn't a long list of caveats, however.

1. From this [Stack Overflow answer](https://stackoverflow.com/a/14686051) by the user Art:

> Like every clever theory this falls apart when meeting reality. Your intermediate functions will allocate memory, grab locks, open files and do all kinds of different things that require cleanup. So in practice setjmp/longjmp are usually a bad idea except in very limited circumstances where you have total control over your environment (some embedded platforms).

2. This Stack Overflow question with the title "Is longjmp supposed to restore the stack?" essentially gets "no" [as a reply](https://stackoverflow.com/questions/58498259/is-longjmp-supposed-to-restore-the-stack), which explains that you can't count on any non-`volatile` variables that are local to the function you jump to, to have the values they had earlier. So in other words, using `longjmp` to jump up the call stack by one function isn't identical to a `return` statement.
