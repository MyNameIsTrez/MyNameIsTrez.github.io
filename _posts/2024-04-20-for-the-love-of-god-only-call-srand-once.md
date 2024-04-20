---
layout: post
title: "For the love of god, only call srand() once"
date: 2024-04-20 06:00:00 +0100
---

One of the most common C mistakes I've seen is to call `srand(time(NULL));` right before using `rand()` to generate a random number:

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void generatePlant() {
    srand(time(NULL));

    // rand() returns a random number between 0 and RAND_MAX (inclusive)
    // The `% 2 == 0` returns `true` if the random number was even
    if (rand() % 2 == 0) {
        printf("Spawning a big plant\n");
    } else {
        printf("Spawning a small plant\n");
    }
}

int main() {
    for (int i = 0; i < 3; i++) {
        generatePlant();
    }
}
```

If you rerun [this program on godbolt.org](https://godbolt.org/z/b8a6c16fa) a few times by modifying the code slightly (like adding a space character), the output is randomly either:

```
Spawning a small plant
Spawning a small plant
Spawning a small plant
```

or

```
Spawning a big plant
Spawning a big plant
Spawning a big plant
```

But almost never a mix of the two. Why is that?

`srand(42);` sets the random number generator's seed (starting value) to 42. Since `time(NULL)` returns the number of seconds that have elapsed since 1970 (called the Unix Epoch), using `srand(time(NULL))` sets the seed to that number of seconds. Since the number of seconds since 1970 normally gets higher every time you restart your program, this ensures that future `rand()` calls won't return the exact same values every time you rerun your program.

If you rerun [the below program on godbolt.org](https://godbolt.org/z/9jzWjcj5v), you'll see that these `rand()` values are always printed. The `rand()` calls themselves also update the seed, so the seed goes `0 -> 1804289383 -> 846930886 -> many rand() calls... -> 0 -> 1804289383`:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    srand(0); // Sets the seed to 0
    printf("%d\n", rand()); // Prints 1804289383, and sets the seed to it
    printf("%d\n", rand()); // Prints 846930886, and sets the seed to it
}
```

Right now the code is basically guaranteeing that the `srand(time(NULL));` call in `generatePlant()` will set the seed to the exact same value (the number of seconds since 1970) for every single plant, as those 3 loops will all likely happen within the same second.

Note that for debugging it is often desirable to get the same random number sequence every time you restart your program. You can easily achieve this by letting the C preprocessor strip the `srand(time(NULL));` out when the program is compiled with `-D NO_SRAND`:
```c
int main() {
#ifndef NO_SRAND // "ifndef" stands for "if not defined"
    srand(time(NULL));
#endif

  // ...
}
```
