---
layout: post
title: "Tiny JSON parser in C"
date: 2024-06-16 12:00:00 +0100
---

My [grug]({{ site.baseurl }} {% link _posts/2024-02-29-creating-the-perfect-modding-language.md %}) programming language that is written in C needs to parse JSON, but since it only needs to be able to parse strings, arrays, and objects, I've decided to write a tiny `json.c` that is roughly 420 lines long.

The JSON spec specifies that the other value types are `number`, `true`, `false` and `null`, but in my case I am fine with having them be stored as strings. You could easily add support for these types however by adding just a few dozen lines to `json.c`, so feel free to.

Instead of using `malloc()`, it makes use of static arrays ([which grow dynamically]({{ site.baseurl }} {% _posts/2024-04-09-static-arrays-are-the-best-vectors.md %}), so essentially act as vectors), which means that parsing a new JSON file overwrites any old parsed data. It also uses `longjmp()` to [keep the clutter of error handling]({{ site.baseurl }} {% _posts/2024-03-21-setjmp-plus-longjmp-equals-goto-but-awesome.md %}) at bay.

Most of the work went into adding tons of tests to ensure it has as close to 100% coverage as possible; `tests.c` is almost as large as `json.c`! The tests also act as documentation. I've fuzzed the program with libFuzzer and documented it in the README. See [the repository](https://github.com/MyNameIsTrez/tiny-json-parser-in-c)'s README for more info. Enjoy! 🙂
