---
layout: post
title: "For the love of god, only call srand() once"
date: 2024-04-20 06:00:00 +0100
---

One of the most common C mistakes I've seen is to do `srand(time(NULL));` in the function where one uses `rand()` to generate random numbers, instead of doing it at the start of `main()`.

The reason is that `srand(time(NULL));` sets the random number generator's seed (starting value) to the number of seconds that have elapsed since 1970 (called the Unix Epoch), so that the `rand()` calls you do after it don't return the exact same values every time you restart your program.

When debugging your program however it is often useful to get the same random number sequence every time you rerun your program, which you can achieve by letting the C preprocessor strip the `srand(time(NULL));` out by compiling with `-D NO_SRAND`:
```c
int main() {
#ifndef NO_SRAND
  `srand(time(NULL));`
#endif

  // ...
}
```

Right now your code is basically guaranteeing that if you call `generatePlant()` 1000 times in a loop, the `srand(time(NULL));` call in your `generatePlant()` will set the seed to the exact same value for every single plant (the number of seconds since 1970), as those 1000 loops will likely all happen within the same second. This can really screw with the rest of the function which expects random numbers that aren't identical for every plant.
