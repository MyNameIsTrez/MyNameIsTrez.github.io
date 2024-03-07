---
layout: post
title: "Technical deep dive into grug"
date: 2024-03-04 12:00:00 +0100
---

# Read my previous post first

My previous post first introduced grug, called [Creating the perfect modding language]({{ site.baseurl }} {% link _posts/2024-02-29-creating-the-perfect-modding-language.md %}).

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

# Resilient

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

It alo enforces that the `define_` functions always come first, then `on_` functions, and finally the user's own helper functions.

# Case-sensitive

All resource paths should match case-sensitively, meaning that if `foo.png` is sitting in the mod, `.sprite_path = Foo.png` would cause our compiler to throw an error.

This is achieved by the game developer by looping over every path part, and checking whether a directory/file with the exact same name is present in the path part.

# Configuration values are static values

As configuration files are also just C code, they could automatically support equations like `.health = 2 * 3` or `.health = get_default_health()`.

Most languages would embrace this, but grug's compiler has specific logic in place that checks that only literal values like `42` or `"foo.png"` are used. This keeps configurations simple and resilient against game updates.

# mod.h as documentation

The `mod.h` header that the game developer exposes to the modder also acts as basic documentation for modders. It lists what functions are available, and what the layouts of the structs look like.

The typical modding workflow either has the local `mod.h` file open, or the file in the game's GitHub. If the modder makes a typo when trying to use one of the function, the compiler will point the modder to the spots in their code where they aren't using `mod.h` correctly.

It is important to note that the example `mod.h` header its `#include <stdint.h>` doesn't expose `int32_t` to modders. This would have to be explicitly done with `typedef uint32_t uint32_t;`.

# Everything stays in a single grug file

This is incredibly valuable, as it makes it much easier to help modders who have bugs in their configuration or scripts, as the single file is all that needs to be sent.

grug has also decided that only one `define_` function can be present per grug file for the sake of readability (so no `define_human_marine()` and `define_gun_glock()` in the same file). That artificial restriction hasn't been put in place on the number of `on_` functions that can be defined in a single grug file.

`define_` functions always have to return a `struct`, whereas `on_` function always have to return `void`.

Mods are not allowed to call `define_` nor `on_` functions.

Contrast this with Lua, where modders use `require()` and `dofile()` to load arbitrary Lua files in a recursive manner, where the entire mod zip often needs to be sent in order for someone to be able to help.

If a modder doesn't want one of their grug files to be loaded, they have to put it in a special `ignored` directory.

# Curly brace scoping

grug files use curly braces for scoping, rather than indentation for scoping, like Python with tabs.

The reason for this is that while working on the [Cortex Command Community Project](https://github.com/cortex-command-community/Cortex-Command-Community-Project), modders frequently had to be explained that their configuration files must use tabs, and not spaces. The difference between the two isn't easy enough to tell for beginners without an IDE, since Notepad and Discord don't put an arrow in the tabs or a dot inside of the spaces. Braces on the other hand are always unambiguous.

The reason not to go with Lua's approach of having specific keywords for specific statements, like `if ... then ... end`, and `while ... do ... end`, is because I still find even myself accidentally writing `if ... do ... end`, or `while ... then ... end`.

# Hot reloading

It's the game's responsibility to recompile the DLLs whenever mod code is changed.

The game can simply load the DLL's functions by attempting `dlsym(handle, "on_death")`, `dlsym(handle, "on_war_cry")`, etc., for every event function the game wants to be able to call.

If this approach feels icky to you, or if you have profiled that the number of `dlsym()` calls you are doing is significant enough to make a noticeable performance impact, [this Stack Overflow answer](https://stackoverflow.com/a/62205128/13279557) shows how to loop over all the function names in a shared library (the Linux equivalent of a DLL).

# How mods are run

1. The mod gets turned into an AST, based off of the mod language's grammar. If the mod tries to use a forbidden C feature, it will likely fail to pass the grammar's rules.
2. For the remaining forbidden C features that the mod is trying to use that _are_ allowed by the grammar, the AST is walked once to check for them.
3. The AST is transpiled into C text.
4. `#include "mod.h"\n\n` is inserted at the start of the text. (This can't be inserted in the previous AST, since the grammar doesn't allow `#include`, nor putting the contents of the C header in the AST directly.)
5. The text is fed into TCC, which outputs a `.dll` file.
6. The game calls `grug_reload_modified_mods()` from `grug.c` whenever it wants (can just be every frame), which will do the work of reloading the functions from the `.dll`.

# No leaks

If the developer wants the modder to have access to features that require dynamic memory allocation, including regular arrays, it is the developer's responsibility to expose functions for creating them.

Developers that expose functions that return a dynamically block of memory are advised to keep track of which of those blocks still need to be freed, so that their game can iterate over all the memory that mods haven't unloaded yet.

Most of the time modders should be able to initialize all memory they need upfront in an `on_init()` function (or whatever your game calls it), but if the developer decides to expose the complexity of freeing memory to modders by exposing a freeing function, the developer is encouraged to let the freeing function throw an error, or crash the game, when something is freed that hasn't been allocated, or when something is freed a second time. This requires the game developer to add some sanitization checks in these exposed functions.

The developer is encouraged to make it easy for modders to check whether their mods have any memory buildup overtime, which can be as simple as showing a rough memory usage counter in a corner of the screen.

# Good performance

Mods are naturally going to be pretty performant given that they are written in C, so aren't garbage collected, and can be heavily optimized by compiling grug files with flags like `-O3` and `-march`.

The developer however is discouraged from exposing any function that can have `O(n)` or worse linear time complexity.
The reasoning for this is that if an actor calls a function that loops over all other actors, 1000 actors will end up doing 1000 times 1000 loops, which will be slow no matter the programming language.

In most cases this is easily avoided by taking the time to make more specific bindings, like the `get_limb` function from the introductory post that takes a limb index, and returns that limb that is attached to us, or a special value that signals that all limbs have been iterated. This is opposed to exposing an `O(n)` function that loops over all entities in the scene, just to find a limb that is attached to us.

# Multithreading

Due to the nature of grug mods being able to mutate the game's state in complex ways, it is not obvious how to multithread mods without potentially creating data races and race conditions.

For this reason grug will not claim to support multithreading, but as the game developer you can of course document that some `on_` functions are only allowed to do specific actions, to guarantee they can be safely called across multiple threads. But grug wouldn't be able to check that modders aren't accidentally doing something they shouldn't, so multithreading is not recommended.

# As few features as possible

This makes learning to write mods for the game, and automating the updating of the AST, as easy as possible.

Compared to C:

- No `switch`, `for`, `do {} while ()`, `goto`, `sizeof`, `;`, `+=`, `++`, `static`, `const`, `inline`, `extern`, `register`, `auto`, `restricted`, `volatile`, `typedef`, `enum`, `union`
- No bitwise operators, globals, multi-line comments, explicit casting, comma operator
- No omitting curly braces, which allows for not having parentheses with `if` and `while` statements
- Single-line comments start with a `#`
- No preprocessor directives like `#include`, `#define`; every function and struct the game wants to export is automatically available
- No sharing state between scripts
- No pointers, so no `*`, `&`, nor `->`
- No explicit return type means the return type is `void`
- No built-in types like `int`; the developer is encouraged to add a clearer typedef, like `i32`, instead in their header
- All compiler warnings on at all times, with `-Werror` to force modders to fix their issues immediately
- No worrying about whether the type declaration is left-to-right or right-to-left, since pointers aren't a thing for the modder
- No forward declarations
- No function pointers
- No arrays
- No ability for the modder to define new structs
- No need to put `struct` in front of `human`, when that is an exposed struct
- The type comes _after_ the variable and function name, with a comma
- `!` got renamed to `not`, `&&` to `and`, `||` to `or`
- The function declaration order does not matter
- Trailing commas in compound statements are required, which eases the copy-pasting of them
- `loop {}` instead of `while (true) {}`

Compared to Lua:

- No metatables
- No `e:()` syntax sugar that secretly means `e.(e)`
- No implicit types
- Only able to return one result, which combined with no pointers and no way for modders to declare structs, means that the only way to return multiple values is by returning a struct the game has exposed
