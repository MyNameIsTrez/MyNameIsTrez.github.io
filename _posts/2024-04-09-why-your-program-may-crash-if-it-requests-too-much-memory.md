---
layout: post
title: "Why your program may crash if it requests too much memory"
date: 2024-02-29 12:00:00 +0100
---

With `malloc()`:

```c
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

#define SIZE 3000000000

size_t *arr;

int main() {
	arr = malloc(SIZE * sizeof(*arr));
	if (arr == NULL) {
		perror("malloc");
		exit(EXIT_FAILURE);
	}

	for (size_t i = 0; i < SIZE; i++) {
		arr[i] = i;
	}
}
```

With a global variable:

```c
#include <stddef.h>

#define SIZE 3000000000

size_t arr[SIZE];

int main() {
	for (size_t i = 0; i < SIZE; i++) {
		arr[i] = i;
	}
}
```

(David Schwartz)[https://serverfault.com/a/420793/1055398] has a great summary 

[OOM (Out-of-memory) killer](https://linux-mm.org/OOM_Killer)
