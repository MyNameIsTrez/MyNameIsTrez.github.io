---
layout: post
title: "How grug catches runtime errors"
date: 2024-11-01 12:00:00 +0100
---

Make sure to read my previous post first called [Creating the perfect modding language]({{ site.baseurl }} {% link _posts/2024-11-01-how-grug-catches-runtime-errors.md %}), since it goes over the basics of grug.

## Runtime errors

grug handles all three possible runtime errors that mods can cause:

1. Division by 0
2. Functions taking too long, often caused by an accidental infinite loop (with Lua the game would hang!)
3. A stack overflow, often caused by recursing too deep

The `Runnable example` header later on shows how to catch a division by 0, but the other runtime errors are handled similarly:

### Detecting functions taking too long, using alrm(2) its SIGALRM

A function taking too long is detected by setting an alarm using [alrm(2)](https://man7.org/linux/man-pages/man2/alarm.2.html), which will raise `SIGALRM`.

It is very important that before every time a mod calls a game function, [sigprocmask(2)](https://man7.org/linux/man-pages/man2/sigprocmask.2.html) is called, since it can be used to disable `SIGALRM` during the game function call.

After the game function has been called, `sigprocmask(2)` is used to enable `SIGALRM` again.

If this is not done, then the game's data is easily left in a corrupt state.

A simple example is that given the game function `void save(int a, int b) { data.a = a; data.b = b; };`, `data.a` could be modified without `data.b` being modified, if the `SIGALRM` happened to land between those two assignments.

The instructions in grug files on the other hand don't have this issue, since grug files don't have global state, so are [reentrant](https://en.wikipedia.org/wiki/Reentrancy_(computing)).

### Handling a stack overflow its SIGSEGV

A stack overflow its `SIGSEGV` is handled by creating a fallback stack using [sigaltstack(2)](https://man7.org/linux/man-pages/man2/sigaltstack.2.html).

This [Stack Overflow](https://stackoverflow.com/a/7342398) answer contains a simple example.

A small note is that `if (sigsetjmp(grug_runtime_error_jmp_buffer, 1)) {` needs to be changed to `if (!grug_in_on_fn && sigsetjmp(grug_runtime_error_jmp_buffer, 1)) {`. `!grug_in_on_fn` makes sure `sigsetjmp()` doesn't get called repeatedly when a modder accidentally causes infinite recursion.

See [grug.c](https://github.com/MyNameIsTrez/grug/blob/main/grug.c) for the full implementation.

## Runnable example

This runnable example shows how grug handles division by 0.

### Compiling

You're encouraged to run the below example program:

```bash
clang main.c grug.c -o main -rdynamic -Wall -Wextra -Werror -Wpedantic -g -fsanitize=address,undefined && \
clang mod.c -o mod.so -shared && \
./main
```

- `-rdynamic` allows `mod.so` to use globals and functions from the main executable.
- `-shared` makes sure a [shared library](https://en.wikipedia.org/wiki/Shared_library) (`.so`/`.dll`) is output

### main.c

```c
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>

#include "grug.h"

static void handle_dlerror(char *function_name) {
    char *err = dlerror();
    if (!err) {
        printf("dlerror() was asked to find an error string for %s(), but it couldn't find one", function_name);
        exit(EXIT_FAILURE);
    }

    printf("%s: %s\n", function_name, err);
    exit(EXIT_FAILURE);
}

static void runtime_error_handler(char *reason, enum grug_runtime_error_type type, char *on_fn_name, char *on_fn_path) {
    (void)type;

    printf("grug runtime error in %s(): %s, in %s\n", on_fn_name, reason, on_fn_path);
}

int main(void) {
    grug_set_runtime_error_handler(runtime_error_handler);

    void *dll = dlopen("./mod.so", RTLD_NOW);
    if (!dll) {
        handle_dlerror("dlopen");
    }

    // We temporarily disable -Wpedantic using these pragmas,
    // because the C standard allows function pointers
    // to have a completely different format than data pointers:
    // https://stackoverflow.com/a/36646099/13279557
    #pragma GCC diagnostic push
    #pragma GCC diagnostic ignored "-Wpedantic"

    void (*on_fire)(int divisor) = dlsym(dll, "on_fire");

    #pragma GCC diagnostic pop

    if (!on_fire) {
        handle_dlerror("dlsym");
    }

    // Passing 2 is fine
    on_fire(2);

    // Passing 0 will cause the function to divide by 0
    on_fire(0);

    if (dlclose(dll)) {
        handle_dlerror("dlclose");
    }
}
```

### mod.c

It is important to note that although `mod.c` is written in C, `grug.c` generates the x86-64 instructions using `mod.grug` directly. In other words, `grug.c` *does not* generate `mod.c` as an intermediate step.

```c
#include "grug.h"

#include <setjmp.h>
#include <signal.h>
#include <stdio.h>

extern jmp_buf grug_runtime_error_jmp_buffer;

extern grug_runtime_error_handler_t grug_runtime_error_handler;

extern volatile char *grug_runtime_error_reason;
extern volatile sig_atomic_t grug_runtime_error_type;

void grug_enable_on_fn_runtime_error_handling(void);
void grug_disable_on_fn_runtime_error_handling(void);

void on_fire(int divisor) {
    if (sigsetjmp(grug_runtime_error_jmp_buffer, 1)) {
        grug_runtime_error_handler(
            (char *)grug_runtime_error_reason,
            grug_runtime_error_type,
            "on_fire",
            "mods/guns/mod.grug"
        );

        return;
    }

    grug_enable_on_fn_runtime_error_handling();

    printf("42 / %d is %d\n", divisor, 42 / divisor);

    grug_disable_on_fn_runtime_error_handling();
}
```

### grug.h

```c
#pragma once

enum grug_runtime_error_type {
    GRUG_ON_FN_DIVISION_BY_ZERO,
    GRUG_ON_FN_TIME_LIMIT_EXCEEDED,
    GRUG_ON_FN_STACK_OVERFLOW,
};

typedef void (*grug_runtime_error_handler_t)(char *reason, enum grug_runtime_error_type type, char *on_fn_name, char *on_fn_path);

void grug_set_runtime_error_handler(grug_runtime_error_handler_t handler);
```

### grug.c

```c
#define _XOPEN_SOURCE 700 // This is just so VS Code can find sigaction

#include "grug.h"

#include <errno.h>
#include <setjmp.h>
#include <signal.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdlib.h>

volatile sig_atomic_t grug_runtime_error_type;
volatile char *grug_runtime_error_reason;

jmp_buf grug_runtime_error_jmp_buffer;

static struct sigaction previous_fpe_sa;

grug_runtime_error_handler_t grug_runtime_error_handler;

void grug_set_runtime_error_handler(grug_runtime_error_handler_t handler) {
    grug_runtime_error_handler = handler;
}

void grug_disable_on_fn_runtime_error_handling(void) {
    // Restore any previously registered SIGFPE sigaction
    if (sigaction(SIGFPE, &previous_fpe_sa, NULL) == -1) {
        abort();
    }
}

static void grug_error_signal_handler_fpe(int sig) {
    (void)sig;

    grug_disable_on_fn_runtime_error_handling();

    grug_runtime_error_type = GRUG_ON_FN_DIVISION_BY_ZERO;
    grug_runtime_error_reason = "Division of an i32 by 0";

    siglongjmp(grug_runtime_error_jmp_buffer, 1);
}

void grug_enable_on_fn_runtime_error_handling(void) {
    static struct sigaction fpe_sa = {
        .sa_handler = grug_error_signal_handler_fpe,
    };

    static bool initialized = false;
    if (!initialized) {
        // Save the signal mask
        if (sigfillset(&fpe_sa.sa_mask) == -1) {
            abort();
        }
        initialized = true;
    }

    // Let grug_error_signal_handler_fpe() be called on SIGFPE
    // This also makes a backup of any previously registered SIGFPE sigaction
    if (sigaction(SIGFPE, &fpe_sa, &previous_fpe_sa) == -1) {
        abort();
    }
}
```
