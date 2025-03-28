---
layout: post
title: "For the love of god, only call srand() once"
date: 2024-04-20 12:00:00 +0100
redirect_from: /2024/04/20/for-the-love-of-god-only-call-srand-once.html
---

One of the most common C mistakes I've seen is to call `srand(time(NULL));` right before using `rand()` to generate a random number:

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void spawnPlant() {
    srand(time(NULL));

    // rand() returns a random number between 0 and RAND_MAX (inclusive)
    // If the random number is odd, `% 2` returns `1`, so `true`
    if (rand() % 2) {
        printf("Spawning a big plant\n");
    } else {
        printf("Spawning a small plant\n");
    }
}

int main() {
    for (int i = 0; i < 3; i++) {
        spawnPlant();
    }
}
```

If you run [this program on godbolt.org](https://godbolt.org/z/b8a6c16fa) a few times by modifying the code slightly (like adding a space character in the code), the output is randomly either:

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

If you run [the below program on godbolt.org](https://godbolt.org/z/vcY77zoh4) a few times, you'll see that these same values always get printed. The `rand()` calls themselves also update the seed, so the seed goes `0 -> 1804289383 -> 846930886` and then `0 -> 1804289383`:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    srand(0); // Sets the seed to 0
    printf("%d\n", rand()); // Prints 1804289383, and sets the seed to it
    printf("%d\n", rand()); // Prints 846930886, and sets the seed to it

    srand(0); // Sets the seed to 0 *again*
    printf("%d\n", rand()); // Prints 1804289383 *again*, and sets the seed to it
}
```

Since the 3 calls of the `spawnPlant()` function will almost always happen within the same second, the `srand(time(NULL));` at the start of `spawnPlant()` will keep resetting the seed to the exact same value, namely the number of seconds that have elapsed since 1970 (the [Unix epoch](https://en.wikipedia.org/wiki/Epoch_(computing))). This is why the program prints the same thing three times.

So if you simply move the `srand(time(NULL));` call from the start of `spawnPlant()` to the start of `main()`, a random mix of `Spawning a small plant` and `Spawning a big plant` will instead be printed.

During debugging and for automated tests it is often handy to get the same random number sequence every time you restart your program. You can easily achieve this by letting the C preprocessor strip the `srand(time(NULL));` out when the program is compiled with `-D NO_SRAND`, since the seed is [guaranteed](https://linux.die.net/man/3/srand) to be `1` by default when `srand()` isn't used:
```c
int main() {
#ifndef NO_SRAND // "ifndef" stands for "if not defined"
    srand(time(NULL));
#endif

    // The rest of your program
}
```
