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
 0  3           carl
 1  2           john

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
chain starts at buckets[69 % 2] = buckets[1] = 2

persons[1].name (= "john") == "john"? yes => "john" found at persons[1]
```

{:start="2"}
2. `bob`:

```
hash("bob") = 420
chain starts at buckets[420 % 2] = buckets[0] = 3

persons[2].name (= "carl") == "bob"? no => chain continues at i=0
persons[0].name (= "trez") == "bob"? no => chain continues at i=-1
i=-1 is the sentinel index, so "bob" is not in the hash table
```

## Profiling this hash table against an array

Hash tables are tricky to profile, since you would ideally test countless combinations of insertions, deletions, and searching.

In this case however we're assuming that the hash table is only built once the entire array is never going to be modified again, so here we just profile how long it takes for the search to figure out if an element is present in the array:

![Screenshot of profiling](profile.png)

I encourage you to scrutinize my tests, but my important takeaway here is that given enough memory, a hash table will always take pretty much zero time, whereas `time_array` starts taking a noticeable amount of time when its search limit argument is around 1000.

If you keep in mind however that `ROUNDS` is causing every search to be repeated 10000 times, the correct conclusion here is that searching an array with 100k elements only took around 2.3 milliseconds (so not 23.86 seconds).

See [its GitHub repo](https://github.com/MyNameIsTrez/array-based-hash-table-in-c) for the code and usage instructions.

## Credits

My explanation is based on flapenguin's great blog post called [ELF: symbol lookup via DT_HASH](https://flapenguin.me/elf-dt-hash).

The hash table implementation is taken from the code Linux uses to perform symbol lookup in ELF files. Its Linux Foundation documentation is [here](https://refspecs.linuxfoundation.org/elf/gabi4+/ch5.dynamic.html#hash). 
