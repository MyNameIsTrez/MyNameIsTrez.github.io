# Grammar of the modding language

TODO:

https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form

```abnf
a = b + c
```

# TODO

- Should the language disallow recursion, in order to make it simpler, and to make sure stack overflows aren't possible?
- Should a string type be provided by the developer, rather than having the user need to worry about what a `char *` and `char []` is? Are they immutable, and not pointers?
- Figure out how modders should be able to use arrays
- Does the language need to implicitly translate `foo: mystruct = {}` to `foo: mystruct = {0}` in order to make sure the memory isn't uninitialized, or is TCC always capable of detecting this for us?
- When TCC throws an error, the modder should be able to inspect the generated C code that it tried to compile, since TCC its line numbers will be useless otherwise, especially since it's in a pretty different language. Ideally we could come up with some way to make it so the user doesn't ever have to view the generated C code.
- Should the language enforce that all functions are in some specific order, like ordering by which gets called first inside the file?
- Does `static` silently need to be added in front of every mod function that the game isn't going to be loading, in order for `dlopen()` and `dlsym()` to work?
- Should mods be able to use `int` and `char`, which aren't able to be `typedef`'d by the game developer in C? With the current design they would not be usable by mods.
- Add stats of how much smaller using TCC is than Lua or LuaJIT
