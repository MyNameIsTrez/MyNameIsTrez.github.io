#pragma once

enum grug_runtime_error_type {
    GRUG_ON_FN_DIVISION_BY_ZERO,
    GRUG_ON_FN_TIME_LIMIT_EXCEEDED,
    GRUG_ON_FN_STACK_OVERFLOW,
};

typedef void (*grug_runtime_error_handler_t)(char *reason, enum grug_runtime_error_type type, char *on_fn_name, char *on_fn_path);

void grug_set_runtime_error_handler(grug_runtime_error_handler_t handler);
