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

    printf("grug runtime error in %s(): %s, at %s\n", on_fn_name, reason, on_fn_path);
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

    on_fire(0);

    if (dlclose(dll)) {
        handle_dlerror("dlclose");
    }
}
