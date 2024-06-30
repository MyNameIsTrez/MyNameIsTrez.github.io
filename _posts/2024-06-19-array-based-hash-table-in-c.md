---
layout: post
title: "Array-based hash table C"
date: 2024-06-19 12:00:00 +0100
---

## Why do I need a hash table

When you want to look for a value in an array, looping over it is simple and fast, but it has a time complexity of `O(n)`. This means that as the array gets really big, it can become slow to find an element in the array.

Hash tables are incredibly useful for turning code that does an `O(n)` iteration over an entire array, into an `O(1)` operation that (on average) instantly finds the element, no matter the size of the array.

It is important to keep in mind that iterating an array is most of the time going to be much faster in practice, since it is so simple. For this reason, and because the array version will be easier to read, I recommend only upgrading arrays to hash tables in C once a performance profiler indicates it to be necessary.

## High-level explanation

This [hash table](https://en.m.wikipedia.org/wiki/Hash_table) requires you to have an array of items that you want to hash. `main.c` contains a `persons` array of `person` structs. Each person has a name and an age.

The [pigeonhole principle](https://en.wikipedia.org/wiki/Pigeonhole_principle) tells us that if we have 3 persons, and we're trying to fit them into 2 buckets, at least one of the buckets must contain more than one person.

In order to fit more than one person in each bucket, each bucket is a linked list.

Usually linked lists are implemented by having every node be `malloc()`ed separately, but `main.c` manages to do it with just has a single, global `buckets` and `chains` array.

I made these arrays are global in order to make the code easier to read, but you could of course just pass them as arguments to the functions.

## Examples

Let's assume that the bucket count is 2 for a moment.

`main()` then pushes into the `persons` array in this order:
1. `trez`, with an age of 7
2. `john`, with an age of 42
3. `carl`, with an age of 69

The program hashes the person structs based on their names, so let's use an imaginary `hash()` function:
1. `hash("trez")` returns 42
2. `hash("john")` returns 69
3. `hash("carl")` returns 38

Here's how those hashes are used to give `buckets` and `chains` their values, where `nbucket` is the number of buckets, and `-1` is the [sentinel value](https://en.wikipedia.org/wiki/Sentinel_value).

```
Bucket[i] has the value of the last entry that has bucket_index equal to i

 i  buckets[i]  name of first person in chain
--  ----------  -----------------------------
 0  2           carl
 1  1           john

One asterisk * indicates the start of a chain

    name =          | hash =      bucket_index =  chain =
 i  persons[i].name | hash(name)  hash % nbucket  chains[i]
--  --------------- | ----------  --------------  ---------
 0  trez            |  42         0               -1 <-\
 1  john            |  69         1 *             -1   |
 2  carl            |  38         0 *              0 --/
```

Let's verify this table, using the algorithm `get_person()` in `main.c` uses:

1. `john`:

```
hash("john") = 69
chain starts at buckets[69 % 2] = buckets[1] = 1

persons[1].name (= "john") == "john"? yes => "john" found at persons[1]
```

{:start="2"}
2. `bob`:

```
hash("bob") = 420
chain starts at buckets[420 % 2] = buckets[0] = 2

persons[2].name (= "carl") == "bob"? no => chain continues at i=0
persons[0].name (= "trez") == "bob"? no => chain continues at i=-1
i=-1 is the sentinel index, so "bob" is not in the hash table
```

## Implementation

The `elf_hash()` function here can be swapped out for any other hashing function, and can be reused for all of your hash tables. See [the GitHub repository](https://github.com/MyNameIsTrez/array-based-hash-table-in-c) for more information. You can try it on Compiler Explorer [here](https://godbolt.org/#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1QCcAaPECAMzwBtMA7AQwFtMQByARg9KtQYEAysib0QXACx8BBAKoBnTAAUAHpwAMvAFYTStJg1AB9U8lJL6yAngGVG6AMKpaAVxYM9DgDJ4GmADl3ACNMYhAADi5SAAdUBUJbBmc3Dz04hJsBX38gllDwqItMKyyGIQImYgIU909oy0xrJIqqghzAkLDIhsrq2rTeto68gp6ASgtUV2Jkdg4AUgAmAGY/ZDcsAGoFlccFAnxBADoEXewFjQBBZbWGDddt3f3D21Pzy5vV9c3MHb2DuhaHhgu8Vhdrrcfo8/s8DsQ/MAwRCbpDVlgaP4tgBZK4ADWMymwACUhAB5AJCLaSJYaGkaT6feGuaxbGJhBQCHYAdgAQoyNABOZAIKpbABUzDYu35kKFrj8BBWS2MBC2TGAmBljO5ABFtXKrgcmDZkFtmaz2cROQw2RyBAoFgBWXm4glE0kUoTO/UrWVGyqm814ABemFVdutDuMCTDBtRAZNeDNCsEyojwRZAGtMARHS63YSSeTKT748ag6mlSq1SKmH58678UXPaWnb7/Z8APRdrYAMWIqBYWwQBAIMQUIB7nJmcwA7lVMMcSMAu8BCF3dn2YrtdcE/K4bLQFABaYDoUHrggypi74K0VDBGVUO9UdBdkpUY7IW60LiClYmUDZMtirdM1U/YxRQUBAIDQBgDi2OtiAlKVMCqYBxh5Tt5UVcCR3%2BXUtgZP0BUFfgULgh01VcBC8GAfx0CQ0UUMlVhYRWIiqIQmi6IYzAmOQiUsLQjCZVQ9jxLQ5Z%2BSWXksIWPkyMuQUEEIrYIDU55nmpBS5Ik6VSLlQUVK0p0Lk4jStPBc4tiWSQ9IANmI1QqBInCTL1MjiFzGZbS0pZnI0VQNCoMLwpfIybi8w0KxAi01StG0JU1AhjCSgQ4JYgzMAUpTjLAmstjwdTM2QHM82dXlIOg2C0L0p1IxtBQY1DLV23jMi5wQOg/ggLg8o8lS8CoDSSt3XctjkABJAIABV0zdQblKFFSfIIPytgCORvG8TrVtWmKExU4bRogeFkBYGIIDQ0gmodKq8B9Y56sIyaNGW4yTqFYIfKYLN9pMw79UNb7BXGyy6wbR6yyik6ju83ziFtDKEJ2fSnrhhHrjis0ADdUDwJjavS%2B0EIgAmic%2B1FBTYFglAICAyoqhQ7pm%2BbFvxO7UZa2M/nFYMw1QKgIEK1VxnGfaab5iMoYQ1qw3U9yBRpiiNJltUIaI9ziv%2BRx7vlvnxKeuSZOpsGxbVZnc2MPwsFUdSaqYGCIB5mH2xe9iGoN3m2qlsG5cbQOFa1U3TfbUrs1zRtrbSu3MFUWGcJplTY5jqO44Ye2fXUzGhoR7HEyDSmmJiVwYNJqMGCysU2LYO7LfVTVzaFEaNJ5kP/gsojCw9EshBboHyJiBFBBFwEwjIdGljmhAwj%2BRcthYEg/gIUVbWWJ1S7J1mtgTuYBMRHFmz7r1nUcBhliWO7e%2BLL1Jbhg7BQTwgIGwPFprm4w%2ByuabvDkYk2AH75xBjTN2LoO5GzDvyCOk1zoEGICyRKZNJZ8i2J7Ng6lbroI1BxIiuCeQdh1KAz4iol71mriXQeZcK6owgFfBBmAQxXzutyYBZEaEIErjaehSwljaFQAgS%2BfC7o0nYcZTh3DMpX1EMQWgLCtiOUFOI46QoSY8wgCojho8CAiyvpvdA59hHXy2KlKR1cGE%2BWYXw8YJ5zi4OAVsHsWxlA6IUNPbk%2BiJE6L0XwgxRiFFmLoVfARQir62Psc3cSzjXGKncVfGkXiwE%2BN4UsfxToL6BJtsEvhsj5E2LseCBx0TeyxMEPEvhSikkqRHoqXxaSlhOh3Bk4xd0KaEyYuKcYQSyapOCI%2BcJjiYluOnjdOgks/GQiOhwSYtBOBOl4J4bgvBUCcH1jOWYsJVg8FIAQTQMzJhZhAJIRyxxHJOkaVIJRjkljciUZIJ0%2BhOCSEWfs0gqyOC8EnBoXZ%2BzJhwFgEgBOTRDwkHIJQDCChlCGBKEIBAqA5xLJ2WgK6dAkwCGhf4WgcKEVLK0KQFFMRerhGQMABQzAJzwoIASocRL6DEACOxTgvBCXErJIeHFiK3nAuQFcYgZLmWkB5RUI4gr%2BCCBEGIdgUgZCCEUCodQHB8W6GiAYIwIBTDGHMMCYIk5ICTFQDEMok4OAngAOpiFoFsc1CcEFMGtWa9k6BDBBhtcQQcKEzzWqoAoQwiQ4ycSYOgdAPkFCs1ohiPwAkVl40nkTTAerNGkEQYIPAbA5qoBcImyYGy5h6EBH4TFsL4VcuWaQOcxAmAxE4DwWZ8zXlKpWZwbAqgQVEBQqoCIjkTyOUkKY5AZoIAINolmLCEBHB3VwIQEg6MVgDV4HsxtEtSBzyDd0JNRynQrGOCsSQ3JJARC3RoFY3JVgaEck8jgLzSB4qbZ8iwIAfmLq0MuuZHAlgNvxR8hdfzJixutEkY5QA).

```c
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_PERSONS 420420

struct person {
	char *name;
	uint32_t age;
};

static struct person persons[MAX_PERSONS];
static size_t persons_size;

static uint32_t buckets[MAX_PERSONS];
static uint32_t chains[MAX_PERSONS];

// From https://sourceware.org/git/?p=binutils-gdb.git;a=blob;f=bfd/elf.c#l193
static uint32_t elf_hash(const char *namearg) {
	uint32_t h = 0;
	for (const unsigned char *name = (const unsigned char *) namearg; *name; name++) {
		h = (h << 4) + *name;
		h ^= (h >> 24) & 0xf0;
	}
	return h & 0x0fffffff;
}

static struct person *get_person(char *name) {
	uint32_t i = buckets[elf_hash(name) % persons_size];

	while (1) {
		if (i == UINT32_MAX) {
			return NULL;
		}

		if (strcmp(name, persons[i].name) == 0) {
			break;
		}

		i = chains[i];
	}

	return persons + i;
}

static void hash_persons(void) {
	memset(buckets, UINT32_MAX, persons_size * sizeof(uint32_t));

	size_t chains_size = 0;

	for (size_t i = 0; i < persons_size; i++) {
		uint32_t bucket_index = elf_hash(persons[i].name) % persons_size;

		chains[chains_size++] = buckets[bucket_index];

		buckets[bucket_index] = i;
	}
}

static void push_person(char *name, uint32_t age) {
	if (persons_size >= MAX_PERSONS) {
		fprintf(stderr, "There are more than %d persons, exceeding MAX_PERSONS\n", MAX_PERSONS);
		exit(EXIT_FAILURE);
	}
	persons[persons_size++] = (struct person){ .name = name, .age = age };
}

int main(void) {
	push_person("trez", 7);
	push_person("john", 42);
	push_person("carl", 69);

	hash_persons();

	printf("%d\n", get_person("trez")->age); // Prints "7"
	printf("%d\n", get_person("john")->age); // Prints "42"
	printf("%d\n", get_person("carl")->age); // Prints "69"
	printf("%p\n", (void *)get_person("bob")); // Prints "(nil)"
}
```

## Profiling this hash table against an array

Hash tables are tricky to profile, since you would ideally test countless combinations of insertions, deletions, and searching.

In this case however we're assuming that the hash table is only built once the entire array is never going to be modified again, so here we just profile how long it takes for the search to figure out if an element is present in the array:

![Screenshot of profiling](https://github.com/MyNameIsTrez/MyNameIsTrez.github.io/assets/32989873/fd8deb4c-7cd9-4444-93b7-1c8b83e96950)

I encourage you to scrutinize my tests, but my important takeaway here is that given enough memory, a hash table will always take pretty much zero time, whereas `time_array` starts taking a noticeable amount of time when its search limit argument is around 1000.

If you keep in mind however that `ROUNDS` is causing every search to be repeated 10000 times, the correct conclusion here is that searching an array with 100k elements only took around 2.3 milliseconds (so not 23.86 seconds).

## Credits

My explanation is based on flapenguin's great blog post called [ELF: symbol lookup via DT_HASH](https://flapenguin.me/elf-dt-hash).

The hash table implementation is taken from the code Linux uses to perform symbol lookup in ELF files. Its Linux Foundation documentation is [here](https://refspecs.linuxfoundation.org/elf/gabi4+/ch5.dynamic.html#hash). 
