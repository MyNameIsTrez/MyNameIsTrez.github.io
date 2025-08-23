---
layout: post
title: "Static C/C++ analysis with PVS-Studio"
date: 2024-08-19 12:00:00 +0100
redirect_from:
  - /2024/08/19/static-c-and-cpp-analysis-with-pvs-studio.html
  - /2024/08/19/static-c-analysis-with-pvs-studio.html
---

This blog post goes over how a student can statically analyze their C/C++ code with [PVS-Studio](https://pvs-studio.com/en/) for free on Ubuntu.

The PVS-Studio team wrote a fascinating post called [100 bugs in Open Source C/C++ projects](https://pvs-studio.com/en/blog/posts/cpp/a0079/), which I highly recommend checking out.

# Setup

1. Install pvs-studio on Ubuntu from the App Center (or using the [PVS-Studio installation page for students](https://pvs-studio.com/en/order/for-students/))
2. Run `pvs-studio-analyzer credentials PVS-Studio Free FREE-FREE-FREE-FREE` to activate a free student license
3. Add this comment to the top of your C file:

```c
// This is a personal academic project. Dear PVS-Studio, please check it.
// PVS-Studio Static Code Analyzer for C, C++, C#, and Java: https://pvs-studio.com
```

# Usage

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

Compiling this program with lots of warnings turned on and fsanitize makes it seem like the program works fine, since it prints `42` successfully:

```bash
clang foo.c -Wall -Wextra -Werror -Wpedantic -fsanitize=address,undefined && ./a.out
```

But there's actually a bug in this function. Let's use PVS-Studio to find it for us!

1. Generate `strace_out` with `pvs-studio-analyzer trace -- gcc foo.c`
2. Generate `pvs.log` with `pvs-studio-analyzer analyze -o pvs.log`
3. Generate `pvs.json` with `plog-converter -a GA:1,2 -t json -o pvs.json pvs.log` (run `plog-converter --help` to get descriptions of these flags)

If you install the [PVS-Studio](https://marketplace.visualstudio.com/items?itemName=EvgeniyRyzhkov.pvs-studio-vscode) extension for VS Code, you should see this `PVS-STUDIO` tab appear in the bottom panel (if you don't see it, refer to [the extension's official PVS-Studio guide](https://pvs-studio.com/en/docs/manual/6646/)):

![PVS-STUDIO tab](https://github.com/user-attachments/assets/165e7433-d4f6-43b3-badb-34cb3dea8541)

Inside of the `PVS-STUDIO` tab, click the `Open report` button, and select the `pvs.json` file we generated. You should now see this:

![PVS-Studio report](https://github.com/user-attachments/assets/83d317cc-7fde-4e38-bb25-d76bf45e54ee)

It warns about lines 8 and 10, which correspond to the `malloc()` and `*foo = 42;` lines.

The message `There might be dereferencing of a potential null pointer 'foo'` is completely correct, and we can resolve it by adding this right after the `malloc()` call:

```c
if (!foo) {
    return EXIT_FAILURE;
}
```

![PVS-Studio report with 0 warnings](https://github.com/user-attachments/assets/f349e234-0b8a-4e63-bafe-3847ccecd7e3)
