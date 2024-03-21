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

# The first idea

In order to address the two problems, I added these global variables:

```c
char error_msg[420];
bool error_happened = false;
```

Which are used to print the message to a buffer, and to remember that something went wrong, like so:

```c
static token get_token(size_t token_index) {
    if (token_index >= tokens.size) {
        snprintf(error_msg, sizeof(error_msg), "Expected a token with index %zu to exist, but that index is out of bounds", token_index);
        error_happened = true;
        return;
    }
    return tokens.tokens[token_index];
}
```
