---
layout: post
title: "Why random programs may crash if you request too much memory"
date: 2024-04-09 08:00:00 +0100
---

TODO: insert gif of htop

This is a gif of [htop](https://en.wikipedia.org/wiki/Htop) showing us that my program first fills up all of my RAM, then all of my swap space, which finally causes the whole computer to freeze.

After a bit, Linux its [OOM (Out Of Memory) killer](https://linux-mm.org/OOM_Killer) decides it's time to kill some programs to free some RAM, resulting in VS Code being killed and me even being logged out of my computer!

Since `sizeof(size_t)` is 8 on my computer, I can use my 24 GB of RAM up by defining `SIZE` to be 3 billion, since 8 * 3 = 24.

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

TODO: show the consequences of making the global variable static.

[David Schwartz](https://serverfault.com/a/420793/1055398)
