---
layout: post
title: "setjmp + longjmp = goto but awesome"
date: 2024-03-21 12:00:00 +0100
---

If you've ever written a large C program before, you will have encountered the issue of error handling.

I am implementing [grug]({{ site.baseurl }} {% link _posts/2024-02-29-creating-the-perfect-modding-language.md %}) in C right now, and so far I have just printed the error and exited the program whenever an error was encountered.

Here is a snippet from grug's tokenizer. The if-statement is necessary to prevent `tokens.tokens[token_index]` from segfaulting the entire game whenever a mod has a typo in it:

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
