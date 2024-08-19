---
layout: post
title: "Static C analysis with PVS-Studio"
date: 2024-08-19 06:00:00 +0100
---

This blog post goes over how a student can statically analyze their C code with [PVS-Studio](https://pvs-studio.com/en/) for free on Ubuntu.

1. Install pvs-studio on Ubuntu from the App Center (or using the [PVS-Studio installation page for students](https://pvs-studio.com/en/order/for-students/))
2. Run `pvs-studio-analyzer credentials PVS-Studio Free FREE-FREE-FREE-FREE` to activate a free student license
3. Add this comment to the top of your C file:

```c
// This is a personal academic project. Dear PVS-Studio, please check it.
// PVS-Studio Static Code Analyzer for C, C++, C#, and Java: https://pvs-studio.com

#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *foo = malloc(sizeof(int));

    *foo = 42;

    printf("%d\n", *foo);

    free(foo);
}
```

Compiling the program with lots of warnings turned on and fsanitize makes it seem like the program works fine, since it prints `42` successfully:

```bash
clang foo.c -Wall -Wextra -Werror -Wpedantic -fsanitize=address,undefined && ./a.out
```

But there's actually a bug in this function. Let's use PVS-Studio to find it for us!

1. Generate `strace_out` with `pvs-studio-analyzer trace -- gcc foo.c`
2. Generate `pvs.log` with `pvs-studio-analyzer analyze -o pvs.log`
3. Generate `pvs.json` with `plog-converter -a GA:1,2 -t json -o pvs.json pvs.log`

If you open `pvs.json`, you'll see it warns about lines 8 and 10, which correspond to the `malloc()` and `*foo = 42;` lines.
