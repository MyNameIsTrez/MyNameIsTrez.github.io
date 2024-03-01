# Priority list

1. Resilience to game updates
2. Simple
3. Secure against malicious mods
4. Imperative syntax with only pure functions
5. Easy to integrate into any existing game

# Example program

The developer creates a header containing the declarations of all functions that are callable by mods:

```c++
#include <cstdint> // int32_t
#include <stdbool.h> // bool

int printf(const char *format, ...);
size_t strlen(const char *s);

typedef int32_t i32;
```

This header is automatically imported by all mods, and mods need :

```c++
struct state {
	name: *char,
	age: i32
}

init() state {
	printf("Hello, World!\n")

	return {
		.name = "foo",
		.age = 42
	}
}

struct bar {
	i: i32,
	is_running: bool
}

update(state s) {
	printf("Name: %s\n", s.name)
	printf("Name length: %d\n", strlen(s.name))
	printf("Age: %d\n", s.age)

	b: bar = { .i = 0 }
	while my_function(b).is_running {
		printf("i is equal to %d\n", i)
		b.i = b.i + 1
	}
}

my_function(int i) bool {
	return i < 3
}
```

# Compiled

So that if the game renamed entity.Health to entity.Lives, the compiler will immediately point out that there is anything wrong in the first place (even with line numbers!)

Contrast this with an interpreted language like Lua, where scripts will silently behaving differently than before, because entity.Health would now always return `nil`, meaning `bar` will always be printed. This makes it practically impossible not to accidentally introduce bugs in complex scripts when porting them to newer versions of the game:

```lua
if entity.Health > 50 then
    print("foo")
else
    print("bar")
end
```

The potential for optimization is a nice bonus on the side, but not the main reason to want mods to be written in a compiled language.

# Tiny embeddable compiler

If one wants to compete with the ease of using Lua in your project, it'd be the most convenient for the perfect modding language's compiler to be a single .c file, as that makes linking trivial, no matter what kind of build script is used.

Since it's hard to make a tiny embeddable compiler from scratch, the perfect modding language should be easily transpilable to C, so that the [Tiny C Compiler](https://en.wikipedia.org/wiki/Tiny_C_Compiler) by Fabrice Bellard can do all of the hard compilation work for us.

Having the compiler be tiny makes sure developers aren't on the fence of whether embedding the compiler in their game would bloat the release executables too much.

The perfect modding language's compiler would do a single pass over the source code to make sure no unknown keywords are found, like `exit()` if `exit` has not been exported by the game's developer header. This, together with not ever allowing mod developers to create pointers (apart from if the developer decides to export one), makes sure the game developer doesn't have to worry about malicious mods.

# No undefined behavior

Fuck C, luv Rust

# No functions nor state is implicitly available to modders

This gives the developer full control over what C/C++ functions modders are allowed to call. The developer just needs to maintain their header that exports functions to modders.

# As few features as possible

This makes automatic updating of the AST as easy as possible

Compared to C:

- No "goto"
- No "for"
- No omitting curly braces, which also immediately allows no parentheses
- No multi-line comments
- No implicit conversion (`if (ptr)` vs. `if (ptr != NULL)`) // TODO: but `if (isActive() == true)` is less readable?
- No preprocessor directives (#include, #define); every function and struct the game exports is automatically available
- No globals
- No sharing state between scripts
- No pointers
- No explicit casting, like Lua
- No semicolons
- No explicit return type means the return type is `void`
- No built-in types like `int`; the developer is encouraged to add a clearer typedef, like `i32`, instead in their header
- All compiler warnings on at all times, with `-Werror` to force modders to fix their issues immediately
- No `+=` operator
- TODO: Strings are immutable, and not pointers?

Compared to Lua:

- No metatables
- No e:() syntax sugar that secretly means e.(e)
- No implicit types
- Only able to return one result, which combined with no pointers means one will need to return a struct to return multiple values. This is good, as it simplifies the language, forces the modder to assign names to all of the returned values, and makes it clear that modders are only allowed to create pure functions that don't modify their arguments, nor global state.

# All code shall be automatically formatted

No more unformatted messes when having to fix other people's code

# TODO

- Should the language use structs?
- Should the language have typedefs?
- Should the language have enums?
- Should the language only allow the user to put stuff on the heap, so that returning a dangling pointer to the memory of a popped stack frame is impossible?
- How should the language keep track of which objects are still reachable? If no UB like double-freeing is desired, and no complex and difficult system like a garbage collector is desired, I think the only option is reference counting?
- Should the language disallow recursion, in order to make it simpler, and to make sure stack overflows aren't possible?
- Should declaration order matter? It should be trivial to forward declare all function and struct definitions automatically at the top of the file, and would make modding less punishing.
- Should a string type be provided by the developer, rather than having the user need to worry about what a `char *` and `char []` is?
- Figure out how modders should be able to use arrays
- Does the language need to implicitly translate `foo: mystruct = {}` to `foo: mystruct = {0}` in order to make sure the memory isn't uninitialized, or is TCC always capable of detecting this for us?
- When TCC throws an error, the modder should be able to inspect the generated C code that it tried to compile, since TCC its line numbers will be useless otherwise, especially since it's in a pretty different language. Ideally we could come up with some way to make it so the user doesn't ever have to view the generated C code. :(
- Should the language enforce that all struct definitions come before the first function definition, for the sake of readability?
- Should the language enforce that all functions are in some specific order, for the sake of readability?
- Right now the example mod returns a custom `state` struct from `init()`, but is there even a way for the game to be able to call this function then?
- How to enforce globals and pointers aren't used by mods?
- Is it worth it to let our compiler prepend the mod's name in front of all of its struct and function names, so that modders don't ever have to worry about clashing names? How about using the mod's ID instead, which could just represent it being the Nth mod that was loaded by the game?
- How should the game load a list of mods, and call all of their `init()` and `update()`?
- Should every mod be its own DLL, or should all mods be put in a single DLL?
