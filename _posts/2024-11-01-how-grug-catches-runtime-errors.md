---
layout: post
title: "How grug catches runtime errors"
date: 2024-11-01 12:00:00 +0100
---

```bash
clang main.c grug.c -o main -Wall -Wextra -Werror -Wpedantic -g -fsanitize=address,undefined && \
clang mod.c -o mod.so -shared && \
./main
```

grug handles all three possible runtime errors that mods can cause:
1. Division by 0
2. Functions taking too long, often caused by an accidental infinite loop (with Lua the game would hang!)
3. Stack overflow, often caused by recursing too deep

The below example shows how to catch a division by 0 its `SIGFPE`, but the other runtime errors are very similar:
- A function taking too long is detected by setting an alarm using [alrm(2)](https://man7.org/linux/man-pages/man2/alarm.2.html), which will raise `SIGALRM`.
- A stack overflow its `SIGSEGV` is handled by creating a fallback stack using [sigaltstack(2)](https://man7.org/linux/man-pages/man2/sigaltstack.2.html). This [Stack Overflow](https://stackoverflow.com/a/7342398) answer contains a simple example.

See [grug.c](https://github.com/MyNameIsTrez/grug/blob/main/grug.c) for the full implementation.
