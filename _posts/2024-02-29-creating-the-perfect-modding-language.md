---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 12:00:00 +0100
---

grug is the name of my modding language.

grug is named after the legendary article [The Grug Brained Developer](https://grugbrain.dev/).

<video src="https://github.com/user-attachments/assets/4e2f0304-e392-4b98-be7d-e0d2802dde52" width="100%" autoplay controls loop muted></video>

The article [Video game modding](https://en.wikipedia.org/wiki/Video_game_modding) on Wikipedia describes modding pretty well:

> Video game modding (short for "modification") is the process of alteration by players or fans of one or more aspects of a video game, such as how it looks or behaves, and is a sub-discipline of general modding. Mods may range from small changes and tweaks to complete overhauls, and can extend the replay value and interest of the game.

Mods are also known as plugins or extensions. The word "mod" is commonly used by games. Keep in mind that when I say "mod" or "game", my modding language is intended to work for any application written in any programming language, so not just games.

## grug example

Here's a `zombie.grug` file that a mod might have:

```grug
define() human {
    return {
        .name = "Zombie",
        .price = 49.95,
        .sprite_path = "sprites/zombie.png",
    }
}

on_kill(killed: id) {
    print_string(get_human_name(me))
    print_string(" killed ")
    print_string(get_human_name(killed))
    print_newline()
}
```

The <span style="color:#f07178">`define`</span> function adds a new <span style="color:#89ddff">`human`</span> variant to the game.

The <span style="color:#C3E88D">`on_kill`</span> function is called by the game whenever the zombie kills someone.

The <span style="color:#C792EA">`print_string`</span> game function prints a string.

That same mod can then add a `marine.grug` file, having its own <span style="color:#C3E88D">`on_kill`</span> function:

```grug
define() human {
    return {
        .name = "Marine",
        .price = 420.0,
        .sprite_path = "sprites/marine.png",
    }
}

kills: i32 = 0

on_kill() {
    kills = kills + 1

    if kills == 3 {
        helper_spawn_sparkles()
        kills = 0
    }
}

helper_spawn_sparkles() {
    i: i32 = 0

    while i < 10 {
        x: i32 = get_human_x(me) + random(-30, 30)
        y: i32 = get_human_y(me) + random(-30, 30)

        spawn_particle("sprites/sparkle.png", x, y)

        i = i + 1
    }
}
```

The <span style="color:#82AAFF">`helper_spawn_sparkles`</span> function is a helper function, which the game can't call, but the <span style="color:#C3E88D">`on_`</span> functions in this file can.

For a full example, I recommend downloading/cloning the [grug terminal game repository](https://github.com/MyNameIsTrez/grug-terminal-game) locally, so you can step through the code of the game and `grug.c` with a debugger.

## complexity _very_, _very_ bad

<img src="https://github.com/user-attachments/assets/2d67d359-8d13-4d38-92cf-8eb646a300aa" width="150" align="right" />

grug is a modding framework that makes the integration of mods to an existing project as easy as possible.

grug is also a compiled programming language, making the experience of writing and maintaining mods as pleasant as possible.

It was designed alongside the writing of this article, and is based on two modding observations:

1. Most mods just want to add basic content, like more guns and creatures
2. Most mods just want to run some basic code whenever a common event happens, like having a human spawn three explosions when they die

### Very few data types

These are grug's data types:
- `string`
- `bool`
- `i32` (int32_t)
- `f32` (float)
- `id` (uint64_t)

There are also `resource` and `entity`, which are just strings that grug will check for existence. So if a mod passes `"sprites/m60.png"` to a function that expects a `resource`, grug will check that the PNG exists.

The same goes for `"ww2:m1_garand"` when it is passed to a function that expects an `entity`, where grug will check that there is a `ww2` mod that contains an `m1_garand` entity.

You might now think "But what if a mod needs a more complex data type, like a pointer, struct, or dynamic array"? The simple answer is that it is the game developer's responsibility to add functions for this.

So a modder might call `vector_string_create()`, which returns an `id`, which is then used when calling `vector_string_push(id, "foo")` and `vector_string_get(id, index)`. Note how it is up to the game developer here to decide whether `index` is [0-based or 1-based](https://en.wikipedia.org/wiki/Zero-based_numbering).

The game developer *could* add a `vector_string_free(id)` function, but this is discouraged, as modders shouldn't be burdened with and counted on calling this function. grug might smell like C, but its goal is to be friendlier to newcomers.

Instead, the game developer should take the responsibility of freeing the vector, when there are no more references to it.

But since reference counting isn't always trivial to do, and since most mods don't actually need more complex data types, game developers are recommended to hold off on exposing memory allocating functions to modders.

### grug is stupidly easy to set up

The game developer only needs to drop `grug.c` into their existing project, which is a 10k line long file, and `grug.h`, which is just over 100 lines long.

`grug.c` contains an entire compiler and linker, currently outputting 64-bit ELF shared objects (which only run on Linux), containing x86-64 instructions (which won't run on ARM CPUs).

grug its GitHub repository is found [here](https://github.com/MyNameIsTrez/grug/).

grug has a VS Code extension that gives `.grug` files syntax highlighting. It can be installed by searching for "grug" in VS Code's extensions tab, or by downloading it [from its Marketplace page](https://marketplace.visualstudio.com/items?itemName=MyNameIsTrez.grug).

I am currently in the process of writing games and non-games that show off grug.

Since most languages can either call functions from `grug.c` directly, or are able to load it as a library, grug can be used by almost every programming language under the sun.

In a nutshell, the game developer:

1. Periodically calls a function from `grug.c`, which will recompile any modified mods, and will store the modified mods in an array.
2. Loops over this array, and copies the data and functions from these modified mods into their own game.

So the game might have a `Gun` class, and the modified mod might up the firerate of the gun, and have a different <span style="color:#C3E88D">`on_fire`</span> function.

## Resources are automatically reloaded

In this video I'm showcasing the gun's sprite being reloaded, but this is a generic system that supports any file type, so audio too:

<video src="https://github.com/user-attachments/assets/6de75130-89dd-4ba3-ba22-c0b3b496109d" width="100%" autoplay controls loop muted></video>

## Runtime error handling

Every possible runtime crash in a grug file is caught.

In this video, look at the console at the bottom of the game for these grug runtime errors:
1. Functions taking too long, caused by infinite loops (with Lua the game would hang!)
2. Division by 0
3. A stack overflow, often caused by recursing too deep

<video src="https://github.com/user-attachments/assets/afb49876-0083-41a9-a99d-dc194caf7536" width="100%" autoplay controls loop muted></video>

The remaining possible runtime errors are for integer overflow/underflow with the addition, subtraction, negation, multiplication, division and remainder operators.

If you're curious *how* grug catches runtime errors, [I wrote a post]({{ site.baseurl }} {% link _posts/2024-11-01-how-grug-used-to-catch-runtime-errors.md %}) about the old implementation that used signal handlers.

It's important to note that the game developer is expected to give the player a setting, for whether they want their <span style="color:#C3E88D">`on_`</span> functions to be in "safe" or "fast" mode. The mode can be changed on the fly by calling `grug_switch_on_fns_to_safe_mode()` and `grug_switch_on_fns_to_fast_mode()` respectively.

The "fast" mode *does not* detect runtime errors, which makes it way faster than the "safe" mode. The default mode is "safe". See my [grug benchmark repository](https://github.com/MyNameIsTrez/grug-benchmarks?tab=readme-ov-file#visualizing-the-stack-trace-with-flamegraph) for more details and nice pictures.

## Documentation, security, and type checking in one

The game developer is responsible for maintaining a `mod_api.json` file, which declares which entities and game functions modders are allowed to call. This ensures that malicious modders have no way of calling functions that might compromise the security of the user. It also allows `grug.c` to catch any potential issues in mods, like passing an `i32` to a game function that expects a `string`.

This is all there is to the `mod_api.json` file:

![image](https://github.com/user-attachments/assets/7bb53b7f-e580-4e94-8828-07f7096f14e1)

The game developer can safely share `mod_api.json` with players, as it also functions as the game's mod API documentation. The optional work of generating and hosting a pretty website around this file, like a wiki, can then be left to the players.

The `mod_api.json` file can just be shipped sitting next to the game's executable, because even if the user uses it to declare the game function `exit()` exists, mods still can't call that function. This is because any mod calling `exit()` in grug will actually be calling `game_fn_exit()` under the hood, which the runtime loader will fail to find, which grug will report with a nice error message.

## Resources and entities are checked during startup and runtime

The game developer can specify which types of resources and entities the game functions accept:

![image](https://github.com/user-attachments/assets/709dceba-f26b-423e-a50a-080f7b4a766f)

The `"resource_extension": ".png"` here means that if `set_gun_sprite_path()` gets called with the `sprite_path` argument `"foo.jpg"`, grug will throw an error, but it won't with `"foo.png"`.

If the `foo.png` file gets moved/renamed/deleted during startup or runtime, grug will also throw an error.

The `"entity_type": "pet"` here means that if `set_gun_pet()` gets called with the `pet` argument `"ferrari"`, grug will throw an error, but it won't with `"rabbit"`.

If the `rabbit` entity gets renamed/deleted during startup or runtime, grug will also throw an error. But the `rabbit` entity can be moved to a different directory within the same mod, without causing grug to throw an error.

grug informs the game of any mod errors during startup and runtime, but the game gets to choose how it presents this information to the user.

The game developer can use `"resource_extension": ""` and `"entity_type": ""` when they want to do the type checking themselves. This is necessary when there's a game function that needs to accept both `.wav` and `.flac` files, or that needs to accept both `pet` and `car` entities.

## grug files are easy to convert to JSON, and vice versa

In this video there is a small Python script that calls `grug.c` its `grug_dump_file_to_json()`, and another that calls its `grug_generate_file_from_json()`:

<video src="https://github.com/user-attachments/assets/4b7d6e3b-2be5-46a0-ab0c-b2caaf5532b7" width="100%" autoplay controls loop muted></video>

This makes it easy to automatically update mods, but it could also be useful for VS Code extensions, or for generating the grug files using an in-game Scratch or Blender-like node system.

## Stability through hundreds of tests and fuzzing

[237 handwritten tests](https://github.com/MyNameIsTrez/grug-tests/tree/main) (at the time of writing) that run automatically on every commit using [GitHub Actions](https://github.com/features/actions), ensure that there are no bugs. The actions run the tests on Linux with [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) and [valgrind](https://valgrind.org/), which check for memory access bugs.

There are three test categories:

1. Error tests: `grug.c` should find an issue in a `.grug` file, like an unexpected character, and return a descriptive error message.
2. Runtime error tests: During the execution of an <span style="color:#C3E88D">`on_`</span> function there is a runtime error, like a division by 0, and a descriptive error message should be returned.
3. OK tests: All `.grug` files should be compiled and linked without any errors, and every single grug feature (statements, operators, etc.) is extensively tested for correctness.

I run [gcovr](https://github.com/gcovr/gcovr) manually from time to time, to find branches of code that I forgot to cover with tests. Right now my tests provide 87.6% line and 36.4% branch coverage. The remaining lines of code are of utility functions that the game can call, which I am not planning to cover with tests. See [Getting 100% code coverage doesn't eliminate bugs](https://blog.codepipes.com/testing/code-coverage.html).

I also run [libFuzzer](https://llvm.org/docs/LibFuzzer.html) manually from time to time, which ensures that even the strangest and most corrupt looking `.grug` files won't ever crash the game. A fuzzer is basically a neural network that generates a random string, throws it into the fuzzed program, and gets a reward if it walked a new path through the fuzzed program's code. If it got a reward, it uses the knowledge that there is a good chance it'll get more rewards if it tries similar strings. In this manner it quickly finds most possible paths through the fuzzed program's code, also finding a few inputs that crashed `grug.c`, which I of course patched.

## Why grug

Like any good programming language, grug was born from frustration. Specifically, over 4 years of frustration keeping the configuration and Lua files of nearly 200 old Cortex Command mods up-to-date with the game.

The configuration language is a bespoke, cursed format that was only readable by the game's buggy parser. It required me to write a pretty complex tokenizer and parser, which I had to write many tests for, compared to if it had been say JSON.

And while I love Lua, it was the bane of the community's existence, as it resulted in an endless flood of mod bug reports in our Discord server. These were incredibly hard to find and fix (though we did our best), due to Lua's interpreted nature. If for example `gun.property_that_was_removed_from_the_game` was used in a mod, then it'd just evaluate to `nil`. Ideally this mod would refuse to run at all until the bug was fixed, like with any compiled language.

Maintaining these mods was a never-ending amount of work.

Lua was also way too complex for most people (since most gamers are not programmers), which meant more cool mods would have been made, had an even simpler scripting language been used.

grug is a stupidly simple configuration and scripting language that only allows mods to use simple functions that either act directly on the game's state, or act on "global" variables that are only visible to the functions in the same grug file (where Zombie 1 isn't able to access Zombie 2's global variables).

Base game content can also be turned into mods in this fashion, which even players who don't want to install mods will appreciate, as it will allow them to disable content that would have otherwise been hardcoded into the game.

## Future plans

I have many plans, but the biggest undertakings will be:
- Writing an impressive Minecraft mod with grug
- Supporting Windows and Mac
- Outputting ARM machine code
- Outputting `.wasm` files, and making a demo for it
- Outputting debug symbols again, so that grug files can be stepped through with a debugger
- Printing friendlier error messages

Feel free to try out [the list of programs showcasing grug](https://github.com/MyNameIsTrez/grug/?tab=readme-ov-file#small-example-programs). :-)
