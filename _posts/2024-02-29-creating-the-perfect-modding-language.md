---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 00:00:00 +0100
---

Inspired by the wise words of grug from the great article [The Grug Brained Developer](https://grugbrain.dev/):

complexity _very_, _very_ bad

![F6BJmvMaEAAVU4S](https://github.com/MyNameIsTrez/MyNameIsTrez.github.io/assets/32989873/8af20dd2-6ed2-4c0d-8e16-62397597283c)

grug is a modding language based on the observation that most mods just want to run some code whenever a common event happens, like firing a weapon, being killed, loading a new area, etc.

grug is able to be a stupidly simple language mainly because it doesn't allow mods to store state, and because it only allows event handling functions to run on the thing that was defined in the same file. grug is just a basic configuration and scripting language that uses pure functions to act directly on the game's state.

Base game content can also be turned into mods in this fashion, which even players who don't want to install mods will appreciate, as it will allow them to disable content that would have otherwise been hardcoded into the game.

# Priority list

- Robust, which is an automatic benefit of compiled languages, making it hard for bugs to silently creep in across game updates
- Simple, by trimming most features from C, while only allowing pure functions
- Stateless, by only allowing mods to mutate the game's state
- Secure, by having the game developer explicitly expose functions
- Easy to integrate, since the grug compiler comes inside of a single `grug.c` and `grug.h` file
- Hot reloadable scripting language, by having the modder create `on_` event handling functions for every single event they want their thing to listen to
- Hot reloadable configuration language, by having the modder create one `define_` function per grug file that fills and returns one of the game's structs

# Example program

Here's a `zombie.grug` file that a mod might have:

```grug
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

That same mod can then add a `marine.grug` file, which can define its own `on_death` function (which is why every grug file needs to be its own DLL):

```grug
define_human() human {
	return {
		.name = "Marine",
		.price = 420,
		.torso.health = 20,
		.left_arm.health = 5,
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

		# If we finished iterating over all the limbs, stop looping
		if lr.status == end {
			break
		}

		halve_limb_health(i, lr)

		i = i + 1
	}
}

halve_limb_health(i: i32, lr: limb_result) {
	l: limb = lr.limb

	set_limb_health(i, l.health, / 2)

	printf("limb %s now has %f health\n", lr.field_name, l.health)
}
```

The game developer gets to choose which things they want to expose to their modders, and it's done by creating a single `mod.h` header like the one below. grug also uses this header to detect mods trying to use something that was not exposed.

```c
#pragma once

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

struct human define_human(void);

void on_death(void);
void on_collision(void);

enum iteration_status {
	not_end,
	end,
};

struct limb_result {
	struct limb limb;
	enum iteration_status status;
	string field_name;
};

struct limb_result get_limb(i32 index);
```

# Compiled

Being compiled (like C) rather than interpreted (like Lua) opens a lot of doors.

If say the game renamed `human.dead` to `human.destroyed` and a mod hasn't applied this change somewhere yet, using that mod in the latest version of the game will have grug internally call TCC ([the Tiny C Compiler](https://en.wikipedia.org/wiki/Tiny_C_Compiler)), which will throw an error with a line number pointing to the line where it wasn't changed yet.

Contrast this with the Lua code below, which _won't_ start throwing an error. This is because `marine.dead` will now always return `nil`, causing `bar` to always be printed. This is just one example of why updating loads of complex Lua scripts to newer versions of the game will always introduce bugs, even if the updating were to be automated.

```lua
if marine.dead then
    print("foo")
else
    print("bar")
end
```

And yes, Lua will throw an error when something like `print(marine.health + 42)` is done if the `health` field were be removed from the game's `human` struct. This error however is often only discovered when some poor sod playing with a gazillion mods accidentally triggers that line of code, since the nature of if-statements is to create edge-cases.

This is why the Cortex Command community has had people reporting errors for years in mods that were repeatedly thought to finally be fixed by members of the community. The sad truth is that fixing all of these tiny Lua bugs that only crop up once in a blue moon across hundreds of mods has always been a Sisyphean task.

An important thing to note is that while the potential of compiled code to execute faster is nice, the main reason grug is a compiled language is with the terrifying examples above. The reason grug is transpiled to C, is because TCC being only around 100 KB is extremely attractive from an adoption point of view.

# Resilience

The game reserves function names beginning with `define_` and `on_`, meaning that modders aren't allowed to create a private `on_foo`. This enables our compiler to throw an error when `define_a` used to be defined, but has been renamed to `define_b`, since the compiler will be able to detect that the `mod.h` header won't be exposing `define_a` anymore.

Developers are encouraged to crash the game if it's detected that a mod does something strange. Since every mod is a set of DLL files, debuggers like GDB will automatically be able to step into them, making it possible for modders to figure out which line of their code needs to be fixed.

The reason outright crashing is recommended, or at least something that forces the mod to be fixed right away, is to minimize the chance that the mod will still have not been fixed in say a week's time, when another person tries to play it.

It's also to discourage modders from releasing buggy mods to players, because it leaves players with a bad impression of the game, and because it also wastes the modder's time when they inevitably get poked to fix it later anyways.

In order to make mods more resistant to files being (re)moved from the game or other mods, resource paths are only allowed to refer to files in their own mod. The downside of this is that mods that want to use images/sounds from vanilla will need to copy them to their own mod, but this is worth the extra resilience.

# Tiny embeddable compiler

If one wants to compete with the ease of using Lua in your project, it'd be the most convenient for the perfect modding language's compiler to be a single `grug.c` file, as that makes linking trivial, no matter what kind of build script is used.

Since it's hard to make a tiny embeddable compiler from scratch, the perfect modding language should be easily transpilable to C, so that the [Tiny C Compiler](https://en.wikipedia.org/wiki/Tiny_C_Compiler) by Fabrice Bellard can do all of the hard compilation work for us.

Having the compiler be tiny makes sure developers aren't on the fence of whether embedding the compiler in their game would bloat the release executables too much.

The perfect modding language's compiler would do a single pass over the source code to make sure no unknown keywords are found, like `exit()` if `exit` has not been exported by the game's developer header. This, together with not ever allowing mod developers to create pointers (apart from if the developer decides to export one), makes sure the game developer doesn't have to worry about malicious mods.

# Enforced opinionated formatting

No more unformatted messes when having to read other people's code.

The AST representation of a grug file describes exactly how the text file should be formatted in order to be valid.

It also enforces that the `define_` functions always come first, then `on_` functions, and finally the user's own helper functions.

# Case sensitivity

All resource paths should match case sensitively, meaning that if `foo.png` is sitting in the mod, `.sprite_path = Foo.png` would cause our compiler to throw an error.

This is achieved by the game developer by looping over every path part, and checking whether a directory/file with the exact same name is present in the path part.

# Configuration values are static values

As configuration files are also just C code, they could automatically support equations like `.health = 2 * 3` or `.health = get_defaylt_healyh()`.

Most languages would embrace this, but grug's compiler has specific logic in place that checks that only literal values like `42` or `"foo.png"` are used. This keeps configurations simple and resilient against game updates.

# mod.h as documentation

The `mod.h` header that the game developer exposes to the modder also acts as basic documentation for modders. It lists what functions are available, and what the layouts of the structs look like.

The typical modding workflow either has the local `mod.h` file open, or the file in the game's GitHub. If the modder makes a typo when trying to use one of the function, the compiler will point the modder to the spots in their code where they aren't using `mod.h` correctly.

It is important to note that the example `mod.h` header its `#include <stdint.h>` doesn't expose `int32_t` to modders. This would have to be explicitly done with `typedef uint32_t uint32_t;`.

# Everything stays in a single grug file

This is incredibly valuable, as it makes it much easier to help modders who have bugs in their configuration or scripts, as the single file is all that needs to be sent.

grug has also decided that only one `define_` function can be present per grug file for the sake of readability (so no `define_human_marine()` and `define_gun_glock()` in the same file). That artificial restriction hasn't been put in place on the number of `on_` functions that can be defined in a single grug file.

`define_` functions always have to return a `struct`, whereas `on_` function always have to return `void`.

Contrast this with Lua, where modders use `require()` and `dofile()` to load arbitrary Lua files in a recursive manner, where the entire mod zip often needs to be sent in order for someone to be able to help.

If a modder doesn't want one of their grug files to be loaded, they have to put it in a special `ignored` directory.

# Curly brace scoping

grug files use curly braces for scoping, rather than indentation for scoping, like Python with tabs.

The reason for this is that while working on the [Cortex Command Community Project](https://github.com/cortex-command-community/Cortex-Command-Community-Project), modders frequently had to be explained that their configuration files must use tabs, and not spaces. The difference between the two isn't easy enough to tell for beginners without an IDE, since Notepad and Discord don't put an arrow in the tabs or a dot inside of the spaces. Braces on the other hand are always unambiguous.

The reason not to go with Lua's approach of having specific keywords for specific statements, like `if ... then ... end`, and `while ... do ... end`, is because I still find even myself accidentally writing `if ... do ... end`, or `while ... then ... end`.

# Hot reloading

It's the game's responsibility to recompile the DLLs whenever mod code is changed.

The game can simply load the DLL's functions by attempting `dlsym(handle, "on_death")`, `dlsym(handle, "on_collision")`, etc., for every event function the game wants to be able to call.

If this approach feels icky to you, or if you have profiled that the number of `dlsym()` calls you are doing is significant enough to make a noticeable performance impact, [this Stack Overflow answer](https://stackoverflow.com/a/62205128/13279557) shows how to loop over all the function names in a shared library (the Linux equivalent of a DLL).

# How mods get turned into DLLs

1. The mod gets turned into an AST, based off of the mod language's grammar. If the mod tries to use a forbidden C feature, it will likely fail to pass the grammar's rules.
2. For the remaining forbidden C features that the mod is trying to use that _are_ allowed by the grammar, the AST is walked once to check for them.
3. The AST is transpiled into C text.
4. `#include "mod.h"\n\n` is inserted at the start of the text. (This can't be inserted in the previous AST, since the grammar doesn't allow `#include`, nor putting the contents of the C header in the AST directly.)
5. The text is fed into TCC, which is told to produce the DLL.

# No leaks

If the developer wants the modder to have access to features that require dynamic memory allocation, including regular arrays, it is the developer's responsibility to expose functions for creating them.

Developers that expose functions that return a dynamically block of memory are advised to keep track of which of those blocks still need to be freed, so that their game can iterate over all the memory that mods haven't unloaded yet.

Most of the time modders should be able to initialize all memory they need upfront in an `on_init()` function (or whatever your game calls it), but if the developer decides to expose the complexity of freeing memory to modders by exposing a freeing function, the developer is encouraged to let the freeing function throw an error, or crash the game, when something is freed that hasn't been allocated, or when something is freed a second time. This requires the game developer to add some sanitization checks in these exposed functions.

The developer is encouraged to make it easy for modders to check whether their mods have any memory buildup overtime, which can be as simple as showing a rough memory usage counter in a corner of the screen.

# Good performance

Mods are naturally going to be pretty performant given that they are written in C, which also implies that no garbage collection lag stutters are possible.

The developer however is discouraged from exposing any function that can have `O(n)` or worse linear time complexity.
The reasoning for this is that if an actor calls a function that loops over all other actors, 1000 actors will end up doing 1000 times 1000 loops, which will be slow no matter the programming language.

In most cases this is easily avoided by taking the time to make more specific bindings, like a function that takes an index, and returns that limb that is attached to us, and returns a sentinel value if all limbs have been iterated. This is opposed to exposing an `O(n)` function that loops over all entities in the scene, just so the modder can test whether it's a limb.

# As few features as possible

This makes learning to write mods for the game, and automating the updating of the AST, as easy as possible.

Compared to C:

- No `switch`
- No `for`
- No `do {} while ()`
- No `goto`
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
- No `static`
- No `const`
- No `inline`
- No `extern`
- No `register`
- No `auto`
- No `restricted`
- No `volatile`
- No worrying about whether the type declaration is left-to-right or right-to-left, since pointers aren't a thing for the modder
- No forward declarations
- No function pointers
- No arrays
- No ability for the modder to define new structs
- No `typedef`
- No `enum`
- No `union`
- No need to put `struct` in front of `human`, when that is an exposed struct
- The type comes _after_ the variable and function name, with a comma
- No bitwise operators
- `!` got renamed to `not`, `&&` to `and`, `||` to `or`
- The function declaration order does not matter
- Trailing commas in compound statements are required, which eases the copy-pasting of them

Compared to Lua:

- No metatables
- No `e:()` syntax sugar that secretly means `e.(e)`
- No implicit types
- Only able to return one result, which combined with no pointers means one will need to return a struct to return multiple values. This is good, as it simplifies the language, forces the modder to assign names to all of the returned values, and makes it clear that modders are only allowed to create pure functions that don't modify their arguments, nor global state.

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
