---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 00:00:00 +0100
---

# Priority list

- Robust, which is an automatic benefit of compiled languages, making it hard for bugs to silently creep in across game updates
- Simple, by trimming most features from C, while only allowing pure functions
- Stateless, by having the mod define functions with specific names that the game can call in events 
- Secure, by having the game developer explicitly expose functions
- Easy to integrate, since everything is inside of a single .c and .h file
- Hot reloadable scripting language, by having every mod be a collection of DLLs, where all state is forced to be stored by the game
- Hot reloadable configuration language, by having the modder create a function `define_human` for every new human type they want to add to the game

# Example program

The developer creates a `mod.h` header that specifies the things that mods are allowed to use:

```c
#include <stdint.h> // int32_t
#include <stdbool.h> // bool

int printf(const char *format, ...);

typedef double f64;
typedef int32_t i32;
typedef char* string;

void set_limb_health(f64 health);

struct limb {
	f64 health;
};

struct human {
	i32 price;
	struct limb torso;
	struct limb left_arm;
	string sprite_path;
};

enum iteration_status {
	not_end,
	end,
};

struct limb_result {
	limb limb;
	iteration_status status;
	string field_name;
};

limb_result get_limb(i32 index);
```

And a mod can then add a `zombie.TODO:extension name` file, which will implicitly be able to use those things:

```c
define_human() human {
	return {
		.name = "Zombie",
		.price = 50,
		.torso.health = 3,
		.left_arm.health = 1,
		.sprite_path = "zombie.png",
	}
}

on_death() {
	printf("Graaaaahhhh...\n")
}
```

The `on_death` function is called by the game whenever the zombie dies. The game can expose as many `on_` event functions as it desires.

That same mod can then add a `marine.TODO:extension name` file, which can define its own `on_death` function, which is why every `TODO:extension name` file has to be its own DLL:

```c
define_human() human {
	return {
		.name = "Marine",
		.price = 420,
		.torso.health = 20,
		.left_arm.health = 5,
		# In order to make mods more resistant against game updates,
		# resource paths should only be allowed to refer to files in their own mod
		.sprite_path = "marine.png",
	}
}

on_death() {
	my_name: string = "John"
	printf("%s died!\n", my_name)
}

on_collision() {
	i: i32 = 0
	while true {
		lr: limb_result = get_limb(i)

		# If we finished iterating over all limbs, break out of this loop
		if (lr.status == end) {
			break
		}

		halve_limb_health(i, lr)

		i = i + 1
	}
}

halve_limb_health(i: i32, lr: limb_result) {
	l: limb = lr.limb

	set_limb_health(i, l.health, / 2)

	printf("%s now has %f health\n", lr.field_name, l.health)
}
```

# Compiled

So that if the game renamed `entity.Health` to `entity.Lives`, the compiler will immediately point out that there is something wrong (including the line number!)

Contrast this with an interpreted language like Lua, where scripts will silently behaving differently than before, because `entity.Health` would now always return `nil`, meaning `bar` will always be printed. This makes it practically impossible not to accidentally introduce bugs in complex scripts when porting them to newer versions of the game:

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

# Resilience

The game reserves function names beginning with `define_` and `on_`, meaning that modders aren't allowed to create a private `on_foo`. This enables our compiler to throw an error when `define_a` used to be defined, but has been renamed to `define_b`, since the compiler will be able to detect that the `mod.h` header won't be exposing `define_a` anymore.

Developers are encouraged to crash the game if it's detected that a mod does something strange. Since every mod is a set of DLL files, debuggers like GDB will automatically be able to step into them, making it possible for modders to figure out which line of their code needs to be fixed.

The reason outright crashing is recommended, or at least something that forces the mod to be fixed right away, is to minimize the chance that the mod will still have not been fixed in say a week's time, when another person tries to play it.

It's also to discourage modders from releasing buggy mods to players, because it leaves players with a bad impression of the game, and because it also wastes the modder's time when they inevitably get poked to fix it later anyways.

# No leaks

If the developer wants the modder to have access to features that require dynamic memory allocation, including regular arrays, it is the developer's responsibility to expose functions for creating them.

Developers that expose functions that return a dynamically block of memory are advised to keep track of which of those blocks still need to be freed, so that their game can iterate over all the memory that mods haven't unloaded yet.

Most of the time modders should be able to initialize all memory they need upfront in an `on_init()` function (or whatever your game calls it), but if the developer decides to expose the complexity of freeing memory to modders by exposing a freeing function, the developer is encouraged to let the freeing function throw an error, or crash the game, when something is freed that hasn't been allocated, or when something is freed a second time. This may require the develoepr to add some detection logic in their exposed functions.

The developer is encouraged to make it easy for modders to check whether their mods have any memory buildup overtime, which can be as simple as showing a rough memory usage counter in a corner of the screen.

# Good performance

Mods are naturally going to be pretty performant given that they are written in C, which also implies that no garbage collection lag stutters are possible.

The developer however is discouraged from exposing any function that can have `O(n)` or worse linear time complexity.
The reasoning for this is that if an actor calls a function that loops over all other actors, 1000 actors will end up doing 1000 times 1000 loops, which will be slow no matter the programming language.

In most cases this is easily avoided by taking the time to make more specific bindings, like a function that takes an index, and returns that limb that is attached to us, and returns a sentinel value if all limbs have been iterated. This is opposed to exposing an `O(n)` function that loops over all entities in the scene, just so the modder can test whether it's a limb.

# As few features as possible

This makes learning to write mods for the game, and automating the updating of the AST, as easy as possible.

Compared to C:

- No `goto`
- No `for`
- No `do {} while ()`
- No omitting curly braces, which allows for not having parentheses with `if` and `while` statements
- Single-line comments start with a `#`
- No multi-line comments
- No preprocessor directives like `#include`, `#define`; every function and struct the game wants to export is automatically available
- No `sizeof`
- No globals
- No sharing state between scripts
- No pointers, so no `*`, `&`, nor `->`
- No explicit casting
- No `;`
- No explicit return type means the return type is `void`
- No built-in types like `int`; the developer is encouraged to add a clearer typedef, like `i32`, instead in their header
- All compiler warnings on at all times, with `-Werror` to force modders to fix their issues immediately
- No `+=`
- No postfix nor suffix `++`
- No `static`, `const`, nor `inline` keywords
- No worrying about whether the type declaration is left-to-right or right-to-left, since pointers aren't a thing for the modder
- No forward declarations
- No function pointers
- No arrays
- No ability for the modder to define new structs
- No typedefs
- No enums
- No unions
- No need to put `struct` in front of `human`, when that is an exposed struct

Compared to Lua:

- No metatables
- No e:() syntax sugar that secretly means e.(e)
- No implicit types
- Only able to return one result, which combined with no pointers means one will need to return a struct to return multiple values. This is good, as it simplifies the language, forces the modder to assign names to all of the returned values, and makes it clear that modders are only allowed to create pure functions that don't modify their arguments, nor global state.

# Automatically formatted

No more unformatted messes when having to fix other people's code

# Hot reloading

It's the game's responsibility to recompile the DLLs whenever mod code is changed.

The game can simply load the DLL's functions by attempting `dlsym(handle, "on_death")`, `dlsym(handle, "on_collision")`, etc., for every event function the game wants to be able to call.

If this approach feels icky to you, or if you have profiled that the number of `dlsym()` calls you are doing is significant enough to make a noticeable performance impact, [this Stack Overflow answer](https://stackoverflow.com/a/62205128/13279557) shows how to loop over all the function names in a shared library (the Linux equivalent of a DLL).

# How mods get turned into DLLs

1. The mod gets turned into an AST, based off of the mod language's grammar. If the mod tries to use a forbidden C feature, it will likely fail to pass the grammar's rules.
2. For the remaining forbidden C features that the mod is trying to use that *are* allowed by the grammar, the AST is walked once to check for them.
3. The AST is transpiled into C text.
4. `#include "mod.h"\n\n` is inserted at the start of the text. (This can't be inserted in the previous AST, since the grammar doesn't allow `#include`, nor putting the contents of the C header in the AST directly.)
5. The text is fed into TCC, which is told to produce the DLL.

# Grammar of the modding language

TODO:

https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form

```abnf
a = b + c
```

# TODO

- How should the language keep track of which objects are still reachable? If no UB like double-freeing is desired, and no complex and difficult system like a garbage collector is desired, I think the only option is reference counting?
- Should the language disallow recursion, in order to make it simpler, and to make sure stack overflows aren't possible?
- Should declaration order matter? It should be trivial to forward declare all function and struct definitions automatically at the top of the file, and would make modding less punishing.
- Should a string type be provided by the developer, rather than having the user need to worry about what a `char *` and `char []` is? Are they immutable, and not pointers?
- Figure out how modders should be able to use arrays
- Does the language need to implicitly translate `foo: mystruct = {}` to `foo: mystruct = {0}` in order to make sure the memory isn't uninitialized, or is TCC always capable of detecting this for us?
- When TCC throws an error, the modder should be able to inspect the generated C code that it tried to compile, since TCC its line numbers will be useless otherwise, especially since it's in a pretty different language. Ideally we could come up with some way to make it so the user doesn't ever have to view the generated C code. :(
- Should the language enforce that all struct definitions come before the first function definition, for the sake of readability?
- Should the language enforce that all functions are in some specific order, for the sake of readability?
- How to enforce globals and pointers aren't used by mods?
- Should the compiler make sure that mods aren't using pointers? On the one hand this may frustrate power users who want to squeeze every bit of performance, but on the other hand it keeps the language extremely simple for any outsiders.
- Does `static` silently need to be added in front of every mod function that the game isn't going to be loading, in order for `dlopen()` and `dlsym()` to work?
- How can the compiler be made to throw an error if the mod uses a type like `int` when it hasn't been exported by the header? Ideally `int` would only be allowed if the header exports. Does this require our compiler need to loop over the header in order to collect all type names? Cause having a hardcoded blacklist of names that aren't allowed to be used by mods like `int` would make it impossible for the game developer to export it.
- Is there a portable way for developers to have `typedef int32_t i32;` in their `mod.h` header, without automatically also exporting `int32_t` to mod developers? I think the only way to achieve this is by having our compiler collect the list of allowed names by looping over `mod.h`. Following includes recursively is absolutely not allowed, since it makes it impossible to tell which typedefs came from `mod.h`, and which came from `stdint.h`.
