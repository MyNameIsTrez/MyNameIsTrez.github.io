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
