---
layout: post
title: "Technical deep dive into grug"
date: 2024-03-04 12:00:00 +0100
---

# Read my previous post first

My previous post first introduced grug, called [Creating the perfect modding language]({{ site.baseurl }} {% link _posts/2024-02-29-creating-the-perfect-modding-language.md %}).

# Mods are holy tests

As every gamer knows, it is incredibly frustrating when you want to play a mod, but find that it does not work on the latest version of the game. The life cycle of any game with mod support is that as the community grows, hundreds to thousands of mods get created, but those mods inevitably stop being maintained by their original creators as they pursue other games or hobbies. The most beloved of those mods will be maintained by the diehard fans in the community, but the vast majority of mods will become unplayable, either in the sense of literally not being playable, or being so bug- and crash-ridden that no one wants to play them anymore. After enough years, the countless thousands of hours of love that were put into these mods will be lost to the sands of time.

But this is where grug stands out from the crowd.

Because grug mods are compiled, and not interpreted, there's an extremely strong guarantee that if a mod still compiles with the latest version of the game, that it will still be very playable. The only conceivable way for bugs to possibly creep into mods, is if the game say halved the thrust of all engines, plummeting modded aircraft into the ground (this is literally something that happened in the Cortex Command Community Project). In cases like this however, it isn't actually the mod's fault, as the game should have offered an automatable path for mods to update their aircraft appropriately, so it does not become the burden of anyone other than the game developer who introduced the change.

As a consequence, this means that a game developer can set up a GitHub Action that runs on every commit, that automatically verifies that all mods on the mod repository still compile. If not, then that means the game developer either needs to push a new commit that fixes the issue in the game engine, or the game developer should apply a program on the mods that automatically updates them so they *do* compile.

# Compiled

Being compiled (like C) rather than interpreted (like Lua) opens a lot of doors.

If say the game renamed `human.dead` to `human.destroyed` and a mod hasn't applied this change somewhere yet, using that mod in the latest version of the game will have grug internally call TCC (the [Tiny C Compiler](https://en.wikipedia.org/wiki/Tiny_C_Compiler)), which will throw an error with a line number pointing to the line where it wasn't changed yet.

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

An important thing to note is that while the potential of compiled code to execute faster is nice, the main reason grug is a compiled language is with the terrifying examples above. The reason grug is transpiled to C is because it is the most widely-supported and popular compiled language, and libtcc that is embedded in grug.c makes it easy to turn a string containing C code into an optimized .dll with only a dozen lines of code. TCC being only around 100 KB is also extremely attractive, since it keeps the grug.c and grug.h files small enough to even be shareable in places with strict file size limits, like Discord. TCC also claims to be "[about 9 times faster than GCC](https://bellard.org/tcc/#speed)", which modders who make use of grug's hot reloading will appreciate.

# Resilient

The game reserves the function name `define` and function names beginning with `on_`, meaning that modders aren't allowed to create their own `on_foo` function. This enables our compiler to throw an error when `on_a` has been renamed to `on_b`, since the compiler is able to detect that the `mod.h` header isn't exposing `on_a` anymore.

Developers are encouraged to crash the game if it's detected that a mod does something strange. Since every mod is a set of DLL files, debuggers like GDB will automatically be able to step into them, allowing modders to step through mods line-by-line to quickly figure out where and why bugs occur. This doesn't require the game itself to ship with debug information available, just the compiled mods themselves, but a game can of course choose to make the debugging experience even better for modders by shipping the game with debug information.

The reason outright crashing is recommended, or at least something that forces the mod to be fixed right away, is to minimize the chance that the mod will still have not been fixed in say a week's time, when another person tries to play it.

It's also to discourage modders from releasing buggy mods to players, because it leaves players with a bad impression of the game, and because it also wastes the modder's time when they inevitably get poked to fix it later anyways.

In order to make mods more resistant to files being (re)moved from the game or other mods, resource paths are only allowed to refer to files in their own mod. The downside of this is that mods that want to use images/sounds from vanilla will need to copy them to their own mod, but this is worth the extra resilience.

Recursion, whether it be direct or indirect, is also disallowed by the compiler. This makes it significantly harder to cause stack overflows, and keeps the language simpler.

# Tiny embeddable compiler

If one wants to compete with the ease of using Lua in your project, it'd be the most convenient for the perfect modding language's compiler to be a single `grug.c` file, as that makes linking trivial, no matter what kind of build script is used.

Since it's hard to make a tiny embeddable compiler from scratch, the perfect modding language should be easily transpilable to C, so that the [Tiny C Compiler](https://en.wikipedia.org/wiki/Tiny_C_Compiler) by Fabrice Bellard can do all of the hard compilation work for us.

Having the compiler be tiny makes sure developers aren't on the fence of whether embedding the compiler in their game would bloat the release executables too much.

The perfect modding language's compiler would do a single pass over the source code to make sure no unknown keywords are found, like `exit()` if `exit` has not been exported by the game's developer header. This, together with not ever allowing mod developers to create pointers (apart from if the developer decides to export one), makes sure the game developer doesn't have to worry about malicious mods.

# Opinionated

No more unformatted messes when having to read other people's code.

Only snake_case is allowed by the compiler. This means that if the game wants to expose a function called `doDamage()`, the game has to write a small wrapper for it:

```bettercpp
void do_damage() { doDamage(); }
```

The AST representation of a grug file describes exactly how the text file should be formatted in order to be valid.

It alo enforces that the `define` function always comes first, then `on_` functions, and finally the user's own helper functions.

`on_` functions are only allowed to take a single argument, which always have to have the name `self`.

# Case-sensitive

All resource paths should match case-sensitively, meaning that if `foo.png` is sitting in the mod, `.sprite_path = Foo.png` would cause our compiler to throw an error.

This is achieved by the game developer by looping over every path part, and checking whether a directory/file with the exact same name is present in the path part.

# Configuration values are static values

As configuration files are also just C code, they could automatically support equations like `.health = 2 * 3` or `.health = get_default_health()`.

Most languages would embrace this, but grug's compiler has specific logic in place that checks that only literal values like `42` or `"foo.png"` are used. This keeps configurations simple and resilient against game updates.

# mod.h as documentation

The `mod.h` header that the game developer exposes to the modder also acts as basic documentation for modders. It lists what functions are available, and what the layouts of the structs look like.

The typical modding workflow either has the local `mod.h` file open, or the file in the game's GitHub. If the modder makes a typo when trying to use one of the function, the compiler will point the modder to the spots in their code where they aren't using `mod.h` correctly.

It is important to note that everything the `mod.h` header includes becomes available for modders to call, so game developers should be careful not to `#include` headers like stdlib.h that allow the modder to call `exit()`. Instead,  game developers should forward declare whatever they want to expose to modders.

# Everything stays in a single grug file

This is incredibly valuable, as it makes it much easier to help modders who have bugs in their configuration or scripts, as the single file is all that needs to be sent.

Each grug file must contain exactly one `define` function. This artificial restriction hasn't been put in place for `on_` functions.

Every mod must contain an `about.grug` file at the root directory of the mod, which is only allowed to contain exactly one function, namely `define()`.

`define` functions are only allowed to immediately return a `struct`, whereas `on_` function always have to return `void`.

Mods are not allowed to call `define` nor `on_` functions.

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

In most cases this is easily avoided by taking the time to make more specific bindings, like the `get_human_in_radius` function from the introductory post that takes `position`, `radius` and `result_index`, and returns one human in the radius at a time, setting `finished_iterating` to true when all humans in the radius have been iterated. This is opposed to the naive approach of exposing an `O(n)` function that loops over all entities in the scene, just to say damage humans in a small radius around us.

# Multithreading

Due to the nature of grug mods being able to mutate the game's state in complex ways, it is not obvious how to multithread mods without potentially creating data races and race conditions.

For this reason grug will not claim to support multithreading, but as the game developer you of course have the freedom to come up with ways to ensure that bytes don't get spliced when two threads try to mutate the same thing at the same time. Since there's no way for grug to tell at compile-time whether there are any potential multithreading bugs, grug won't advertise itself as supporting multithreading, even though most languages would.

# As few features as possible

This makes learning to write mods for the game, and automating the updating of the AST, as easy as possible.

Compared to C:

- No `while`, `for`, `do {} while ()`, `switch`, `goto`, `sizeof`, `+=`, `++`, `static`, `const`, `inline`, `extern`, `register`, `auto`, `restricted`, `volatile`, `typedef`, `enum`, `union`
- No bitwise operators, multi-line comments, explicit casting, comma operator
- No omitting curly braces, which allows for not having parentheses with `if` and `while` statements
- Single-line comments start with `#`, rather than `//`
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
- No conditional ternary operator (`condition ? result1 : result2`)
- No need to put `struct` in front of `human`, when that is an exposed struct
- No `.` in front of compound literal field keys
- The type comes _after_ the variable and function name, with a comma
- `true` and `false` are built-in
- `!` got renamed to `not`, `&&` to `and`, `||` to `or`
- The function declaration order does not matter
- Trailing commas in compound statements are required, which eases the copy-pasting of them
- Globals are required to be explicitly initialized with a value
- Globals can only be put between the `define` function and the first `on_` function
- Variable shadowing is disallowed

Compared to Lua:

- No metatables
- No `e:()` syntax sugar that secretly means `e.(e)`
- No implicit types
- Only able to return one result, which combined with no pointers and no way for modders to declare structs, means that the only way to return multiple values is by returning a struct the game has exposed
- No single-quoted strings, though they are allowed *within* a double-quoted string
