---
layout: post
title: "Use a static array instead of the heap"
date: 2024-04-09 12:00:00 +0100
---

TODO: Intro that shows off the important point that it's not well-known that a huge static array doesn't waste RAM, and that it grows like a vector, one page at a time, rather than doubling in size.

<link rel="stylesheet" type="text/css" href="/assets/posts/2024-04-09-use-a-static-array-instead-of-the-heap/asciinema-player.css" />
<div id="demo"></div>
<script src="/assets/posts/2024-04-09-use-a-static-array-instead-of-the-heap/asciinema-player.min.js"></script>
<script>
AsciinemaPlayer.create('/assets/posts/2024-04-09-use-a-static-array-instead-of-the-heap/htop.cast', document.getElementById('demo'), {
	cols: 80,
	rows: 3,
	autoPlay: true,
	loop: true,
	idleTimeLimit: 0.5,
	controls: false,
});
</script>

This gif of [htop](https://en.wikipedia.org/wiki/Htop) shows my program filling up all of my RAM. It then fills all of my swap space, which eventually causes the whole computer to freeze.

I had to do several takes of this recording and stop it early, as Linux its [OOM (Out Of Memory) killer](https://linux-mm.org/OOM_Killer) quickly decides it's time to kill some programs to free up RAM. It even kills innocent programs, somehow causing me to get logged out of my computer!

Since `sizeof(size_t)` is 8 on my computer, I can use my 24 GB of RAM up by defining `SIZE` to be 3 billion, since 8 \* 3 = 24.

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

Even after zeroing the array with `bzero()` and `foo` is printed here, `arr` its memory is **_not_** given back until the end of the process:

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

	while (1) {}
}
```

This is how I typically use it:

```c
#include <stdio.h>

#define MAX_PERSONS 1337

struct Person {
  int age;
};

// It's important to note you *don't* instantly use `MAX_PERSONS * sizeof(person)` bytes
// This is more like a dynamic array or vector, where the OS adds another page
// whenever you access a new page (memory is split into 4096 byte pages typically)
static struct Person persons[MAX_PERSONS];

// "static" here and for nodes[] makes the global not accessible to other C files
static size_t persons_size; // All global and static variables are guaranteed to be 0-initialized

void push_person(struct Person person) {
  persons[persons_size++] = person;
}

void print_persons() {
  printf("Persons:\n");
  for (size_t i = 0; i < persons_size; i++) {
    printf("persons[%zu]: %d\n", i, persons[i].age);
  }
}

int main() {
  push_person((struct Person){.age=42});
  push_person((struct Person){.age=69});

  print_persons();

  // No need to free anything! You can set the size back to 0 to "reset" the array if you like
  persons_size = 0;
  print_persons();
}
```

TODO: Show the consequences of making the global variable static.

TODO: Explain that if you put `static` in front of it, the compiler often completely optimizes the array away.

TODO: Use [David Schwartz](https://serverfault.com/a/420793/1055398) its summary of swap space in order to explain the basics.

TODO: Explain that `malloc()` returns `NULL` if you request too much memory.

TODO: Explain that you can't get a stack overflow with a static array or global variable, since they're both stored as globals, so not the stack.

TODO: Explain that a static array can be made ridiculously large at compile-time, and that you only get an error (which one was it again) when you try to run the executable on a computer that doesn't have enough RAM.

TODO: Show how you can check how many bytes of memory will be used at most, using something like [size/objdump/nm](https://stackoverflow.com/a/912396/13279557) to check the data segment size.

TODO: Explain why the non-static global variable compiled, but gives an error when it's ran, including the specific error name.

TODO: Explain the pros and cons of using a global variable, instead of `malloc()`, including that a global variable has a hardcoded size.
