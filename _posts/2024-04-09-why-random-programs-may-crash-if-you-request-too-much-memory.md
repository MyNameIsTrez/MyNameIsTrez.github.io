---
layout: post
title: "Why random programs may crash if you request too much memory"
date: 2024-04-09 08:00:00 +0100
---

My Ubuntu computer has 24 GB of RAM, with 2 GB of swap space.

Since `sizeof(size_t)` is 8 on my computer, I can use my 24 GB of RAM up by defining `SIZE` to be 3 billion, since 8 * 3 = 24.

[htop](https://en.wikipedia.org/wiki/Htop) lets us view the RAM first filling up, then swap, and finally that the computer freezes until Linux its OOM killer kills some programs, even logging me out of my computer.

TODO: insert gif of RAM filling up, then swap filling up, and then htop hanging.

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

[OOM (Out Of Memory) killer](https://linux-mm.org/OOM_Killer)
