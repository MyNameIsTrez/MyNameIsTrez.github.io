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
