---
layout: post
title: "Use a static array instead of the heap"
date: 2024-04-09 12:00:00 +0100
---

TODO: Intro that shows off the important point that it's not well-known that a huge static array doesn't waste RAM, and that it grows like a vector, one page at a time, rather than doubling in size.

![output](https://github.com/MyNameIsTrez/MyNameIsTrez.github.io/assets/32989873/40e203c4-befd-4035-9eb3-c46907c34c7c)

This gif of [htop](https://en.wikipedia.org/wiki/Htop) shows my program filling up all of my RAM. It then fills all of my swap space, which eventually causes the whole computer to freeze.

I had to do several takes of this recording and stop it early, as Linux its [OOM (Out Of Memory) killer](https://linux-mm.org/OOM_Killer) quickly decides it's time to kill some programs to free up RAM. It even kills innocent programs, somehow causing me to get logged out of my computer!

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

There is no way to have the system shrink the amount of memory used by global variables.

Even after zeroing the array with `bzero()` and `foo` is printed here, `arr` its memory is ___not___ given back until the end of the process:

```c
#include <stddef.h>
#include <stdio.h>
#include <strings.h>

#define SIZE 500000000

size_t arr[SIZE];

int main() {
  for (size_t i = 0; i < SIZE; i++) {
    arr[i] = i;
  }
  bzero(arr, sizeof(arr));
  printf("foo\n");
  while (1) {
  }
}
```

TODO: Show the consequences of making the global variable static.

TODO: Explain that if you put `static` in front of it, the compiler often completely optimizes the array away.

TODO: The takeaway on how to prevent this issue, and why it matters.

TODO: Use [David Schwartz](https://serverfault.com/a/420793/1055398) its summary of swap space in order to explain the basics.

TODO: Explain that `malloc()` returns `NULL` if you request too much memory.

TODO: Explain that you can't get a stack overflow with a static array or global variable, since they're both stored as globals, so not the stack.

TODO: Explain that a static array can be made ridiculously large at compile-time, and that you only get an error (which one was it again) when you try to run the executable on a computer that doesn't have enough RAM.

TODO: Show how you can check how many bytes of memory will be used at most, using something like [size/objdump/nm](https://stackoverflow.com/a/912396/13279557) to check the data segment size.

TODO: Explain why the non-static global variable compiled, but gives an error when it's ran, including the specific error name.

TODO: Explain the pros and cons of using a global variable, instead of `malloc()`, including that a global variable has a hardcoded size.

TODO: Explain why memory grows over time, instead of being allocated all at once, with an explanation of pages.
