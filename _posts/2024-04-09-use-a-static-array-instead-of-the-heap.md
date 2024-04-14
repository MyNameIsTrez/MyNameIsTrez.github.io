---
layout: post
title: "Use a static array instead of the heap"
date: 2024-04-09 12:00:00 +0100
---

What if I told you that C has a built-in vector?

No, it doesn't have an _actual_ vector type, but since it doesn't require any function calls at all (like `realloc()`), and works on most computers, I still count it.

Here I run a program that grows such a vector with `./a.out`, where I use [htop](https://en.wikipedia.org/wiki/Htop) to see my RAM and swap space being filled by it:

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

The trick is that if you make a huge static array, it doesn't immediately use all of that memory when the program is started. The same goes for `malloc(1000000)`.

This is because memory is split into [pages](https://en.wikipedia.org/wiki/Page_(computer_memory)) of usually 4096 bytes, where your program doesn't actually get a page until it tries to write to it.

```c
#include <stddef.h>

#define SIZE 1000000

size_t arr[SIZE];

int main() {
    for (size_t i = 0; i < SIZE; i++) {
        arr[i] = i;
    }
}
```

So when `i` is 0, the program tries to do `arr[i]`, which triggers the first [page fault](https://en.wikipedia.org/wiki/Page_fault). _This_ is what causes the operating system's kernel to give your program the page.

Similarly, the second page is given when `i` is 4096, and so on until you run out of memory, just like with `realloc()` or a C++ `std::vector`.

So this array acts like a vector that grows one page at a time, and explains why the RAM usage goes up by increments, rather than doubling like a vector usually would!

If you make the array extremely large, your program will still compile just fine. Once you try to run the executable, however, the operating system will check that you _currently_ have enough RAM available to hold the entire array in memory, assuming it may grow to its maximum size.

This is why I recommend setting the maximum number of entries to a strategic value that will almost certainly never be reached, while still being low enough that even with 1 GB of leftover RAM the program is allowed to boot.

The below program, which you can play around with on godbolt [here](https://godbolt.org/z/n446KGdvK), showcases how I use static arrays in practice.

```c
#include <stdio.h>
#include <stdlib.h>

#define MAX_PERSONS 10000000

struct Person {
    int age;
};

// "static" here makes the global not accessible to other C files
static struct Person persons[MAX_PERSONS];

// All global and static variables are guaranteed to be initialized to 0
static size_t persons_size;

static void push_person(struct Person person) {
    if (persons_size >= MAX_PERSONS) {
        fprintf(stderr, "Error: MAX_PERSONS of %d exceeded!\n", MAX_PERSONS);
        // You can use longjmp() to return the player to the main menu of a game
        exit(EXIT_FAILURE);
    }
    persons[persons_size++] = person;
}

static void print_persons(void) {
    printf("Persons:\n");
    for (size_t i = 0; i < persons_size; i++) {
        printf("persons[%zu]: %d\n", i, persons[i].age);
    }
}

int main(void) {
    push_person((struct Person){.age=42});
    push_person((struct Person){.age=69});

    print_persons();

    // You can set the size back to 0 to "reset" the array,
    // in case you want to fill the array with new persons
    persons_size = 0;
    push_person((struct Person){.age=7});
    print_persons();

    // No need to free anything!
}
```

The `persons` array will use `MAX_PERSONS * sizeof(struct Person)` -> `10 million * 4` -> 40 MB of memory, which is negligible on most computers.

We can verify that this number is correct by just inspecting the executable with `size a.out`:

```
   text    data     bss     dec     hex filename
   2213     632 40000064        40002909        262655d a.out
```

- [text](https://en.wikipedia.org/wiki/Code_segment) is how many bytes the Assembly code takes
- [data](http://en.wikipedia.org/wiki/Data_segment) is how many bytes hardcoded data, like the `"Persons:\n"` string in this program, takes
- [bss](http://en.wikipedia.org/wiki/.bss) is how many bytes globals and statics, like the `persons` array in this program, takes
- dec is the size of the text, data and bss size added together in decimal
- hex is the same number in hexadecimal

If you don't like these static globals, you can just move the `persons` and `persons_size` lines into `main()`, and pass them as arguments into `push_person()` and `print_persons()`. `persons` can't cause a [stack overflow](https://en.wikipedia.org/wiki/Stack_buffer_overflow), as long as you keep it `static`, since the keyword basically turns it into a global variable. The only difference with a global being that you now have to let `main()` pass `persons` as an argument into `push_person()` and `print_persons()`.

This program uses `if (persons_size >= MAX_PERSONS)` to gracefully handle running out space in the `persons` array. If the program were to be slightly rewritten to use `realloc()`, `push_person()` would check whether `realloc()` returned `NULL`, and one would typically `free()` the memory at some point, if only to please leak detectors. In C++ you'd have to catch `std::bad_alloc` to gracefully handle running out of memory, but most C++ programs don't bother doing that.
