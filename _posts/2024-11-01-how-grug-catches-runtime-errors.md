---
layout: post
title: "How grug catches runtime errors"
date: 2024-11-01 12:00:00 +0100
---

Make sure to read my previous post first called [Creating the perfect modding language]({{ site.baseurl }} {% link _posts/2024-02-29-creating-the-perfect-modding-language.md %}), since it goes over the basics of grug.

## Runtime errors

grug handles all three possible runtime errors that mods can cause:

1. Division by 0
2. Functions taking too long, often caused by an accidental infinite loop (with Lua the game would hang!)
3. A stack overflow, often caused by recursing too deep

See the bottom of this post for details on how #2 and #3 handled.

## Runnable example

This runnable example shows how grug handles division by 0.

### Compiling and running

You're encouraged to run the below example program:

```bash
clang main.c grug.c -o main -rdynamic &&
clang mod.c -o mod.so -shared &&
./main
```

- `-rdynamic` allows `mod.so` to access `grug.c` its globals and functions
- `-shared` makes sure a [shared library](https://en.wikipedia.org/wiki/Shared_library) (`.so`/`.dll`) is output

This is the expected output:

```
42 / 2 is 21
grug runtime error in on_fire(): Division of an i32 by 0, in mods/guns/mod.grug
```

#### main.c

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

#### mod.c

It is important to note that although `mod.c` is written in C, `grug.c` generates the x86-64 instructions using `mod.grug` directly. In other words, `grug.c` *does not* generate `mod.c` as an intermediate step.

This code makes use of `sigsetjmp()`, which [I wrote a blog post about]({{ site.baseurl }} {% link _posts/2024-03-21-setjmp-plus-longjmp-equals-goto-but-awesome.md %}) that I recommend you check out first. The `sig` prefix is necessary to ensure the correct behavior later down when we longjmp out of a signal handler; see [this Stack Overflow answer](https://stackoverflow.com/a/20755336/13279557) for a good explanation of the prefix.

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

#### grug.h

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

#### grug.c

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
        // Initialize the signal set sa_mask with all signals
        // sa_mask contains the signals that are blocked during the signal handler
        // This prevents another signal interrupting our handler
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

## Detecting functions taking too long

A function taking too long could be detected by setting an alarm using [alarm(2)](https://man7.org/linux/man-pages/man2/alarm.2.html), which will raise `SIGALRM`.

The problem is that `alarm(2)` only allows you to set an alarm in seconds. Since grug wants to allow a timeout to happen within 16.66 milliseconds (a single frame of a 60 FPS game), [timer_create(2)](https://man7.org/linux/man-pages/man2/timer_create.2.html) is used to get nanosecond granularity.

In order to prevent corrupting the game's data, [sigprocmask(2)](https://man7.org/linux/man-pages/man2/sigprocmask.2.html) is used to disable `SIGALRM` before a mod calls a game function.

A simple example of corruption is that given the game function `void save(int a, int b) { data.a = a; data.b = b; };`, `data.a` could be modified without `data.b` being modified, if a `SIGALRM` happened to land between those two assignments.

After the game function has been called, `sigprocmask(2)` is used to enable `SIGALRM` again.

Because grug entity instances have their own global variables, grug functions also aren't [reentrant](https://en.wikipedia.org/wiki/Reentrancy_(computing)). This is acceptable however, since corrupt entity instance globals *can't* cause the game to crash.

There are ways to reset the globals of grug entities, though:

1. The game can reinitialize the globals of any entity instances which had a runtime error
2. The player can despawn the old instance of an entity, and spawn a new one

## Handling stack overflows

A stack overflow its `SIGSEGV` is handled by creating a fallback stack using [sigaltstack(2)](https://man7.org/linux/man-pages/man2/sigaltstack.2.html).

This [Stack Overflow](https://stackoverflow.com/a/7342398) answer contains a simple example.

A small note is that grug doesn't allow modders to call `on_` functions, which ensures the original `sigsetjmp()` call its `jmp_buf` doesn't get overwritten.

See [grug.c](https://github.com/MyNameIsTrez/grug/blob/main/grug.c) for the full implementation.
