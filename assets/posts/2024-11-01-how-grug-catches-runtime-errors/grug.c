#include "grug.h"

#include <setjmp.h>
#include <signal.h>

static volatile sig_atomic_t grug_runtime_error_type;
jmp_buf grug_runtime_error_jmp_buffer;

void grug_set_runtime_error_handler(grug_runtime_error_handler_t handler) {
    (void)handler; // TODO: Use
}

void grug_disable_on_fn_runtime_error_handling(void) {
	if (sigaction(SIGFPE, &previous_fpe_sa, NULL) == -1) {
		abort();
	}
}

static void grug_error_signal_handler_fpe(int sig) {
	(void)sig;

	grug_disable_on_fn_runtime_error_handling();

	grug_runtime_error_type = GRUG_ON_FN_DIVISION_BY_ZERO;

	siglongjmp(grug_runtime_error_jmp_buffer, 1);
}
