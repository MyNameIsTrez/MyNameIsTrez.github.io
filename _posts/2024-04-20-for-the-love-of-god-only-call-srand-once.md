---
layout: post
title: "For the love of god, only call srand() once"
date: 2024-04-20 06:00:00 +0100
---

One of the most common C mistakes I've seen is to call `srand(time(NULL));` right before one uses `rand()` to generate a random number:

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void generatePlant() {
    srand(time(NULL));

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

If you rerun [this program on godbolt.org](https://godbolt.org/z/z66hYj3K6) a few times by modifying the code slightly (like adding a space character), the output is randomly either:

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

The purpose of `srand(time(NULL));` is to set the random number generator's seed (starting value) to the number of seconds that have elapsed since 1970 (called the Unix Epoch). This way, any `rand()` calls you do after it don't return the exact same values every time you restart your program.

Right now your code is basically guaranteeing that if you call `generatePlant()` 3 times in a loop, the `srand(time(NULL));` call in your `generatePlant()` will set the seed to the exact same value for every single plant (the number of seconds since 1970), as those 3 loops will likely all happen within the same second. This can really screw with the rest of the function which expects random numbers that aren't identical for every plant.

Note that while debugging your program, it is often desirable to get the same random number sequence every time you restart your program. You can easily achieve this by letting the C preprocessor strip the `srand(time(NULL));` out when the program is compiled with `-D NO_SRAND`:
```c
int main() {
#ifndef NO_SRAND
    srand(time(NULL));
#endif

  // ...
}
```
