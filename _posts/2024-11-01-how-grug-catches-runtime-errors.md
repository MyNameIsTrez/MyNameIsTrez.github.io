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
- A function taking too long is detected by setting an alarm using [alrm(2)](https://man7.org/linux/man-pages/man2/alarm.2.html), which will raise `SIGALRM`. It is very important that before every time a mod calls a game function, [sigprocmask(2)](https://man7.org/linux/man-pages/man2/sigprocmask.2.html) is called, since it can be used to disable `SIGALRM` during the game function call. After the game function has been called, `sigprocmask(2)` is used to enable `SIGALRM` again. If this is not done, then the game's data is easily left in a corrupt state. A simple example is that given the game function `void save(int a, int b) { data.a = a; data.b = b; };`, `data.a` could be modified without `data.b` being modified, if the `SIGALRM` happened to land between those two assignments. The instructions in grug files on the other hand don't have this issue, since grug files don't have global state, so are [reentrant](https://en.wikipedia.org/wiki/Reentrancy_(computing)).
- A stack overflow its `SIGSEGV` is handled by creating a fallback stack using [sigaltstack(2)](https://man7.org/linux/man-pages/man2/sigaltstack.2.html). This [Stack Overflow](https://stackoverflow.com/a/7342398) answer contains a simple example.

See [grug.c](https://github.com/MyNameIsTrez/grug/blob/main/grug.c) for the full implementation.
