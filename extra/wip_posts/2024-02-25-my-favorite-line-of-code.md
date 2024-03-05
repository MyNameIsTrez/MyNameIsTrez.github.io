---
layout: post
title: "My favorite line of code"
date: 2024-02-25 12:00:00 +0100
---

This also goes by the name of the "[erase-remove idiom](https://en.wikipedia.org/wiki/Erase%E2%80%93remove_idiom)".

cppreference.com has a page on a possible implementation of [std::remove](https://en.cppreference.com/w/cpp/algorithm/remove#Possible_implementation):

```c++
template<class ForwardIt, class T>
ForwardIt remove(ForwardIt first, ForwardIt last, const T& value)
{
    first = std::find(first, last, value);
    if (first != last)
        for (ForwardIt i = first; ++i != last;)
            if (!(*i == value))
                *first++ = std::move(*i);
    return first;
}
```

This loops, whereas the swap-remove I am referring to is about removing a value at index `i` with this single line of code:

```
arr[i] = arr[--len];
```

TODO: example with random values for arr, i, len

TODO: example of it being a super easy and efficient way to implement a Set of pixels you still want to pick with rand(len)

TODO: think of a name for swap_remove + yin-yang array pair Set technique
