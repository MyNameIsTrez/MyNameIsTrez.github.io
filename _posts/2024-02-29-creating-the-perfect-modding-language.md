---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 12:00:00 +0100
---

grug is the name of my modding language, and its name is based on the legendary article [The Grug Brained Developer](https://grugbrain.dev/):

<video src="https://github.com/user-attachments/assets/4e2f0304-e392-4b98-be7d-e0d2802dde52" width="100%" autoplay controls loop muted></video>

The article [Video game modding](https://en.wikipedia.org/wiki/Video_game_modding) on Wikipedia describes modding pretty well:

> Video game modding (short for "modification") is the process of alteration by players or fans of one or more aspects of a video game, such as how it looks or behaves, and is a sub-discipline of general modding. Mods may range from small changes and tweaks to complete overhauls, and can extend the replay value and interest of the game.

Mods and plugins are the same thing, though the word "mod" is normally used by games. Keep in mind that when I say "mod" or "game", my modding language's goal is to work for any application written in any programming language, so not just games.

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

There are also `resource` and `entity`, which are just strings that grug will check for existence. So if a mod passes `"sprites/m60.png"` to a function that expects a `resource`, grug will check that the PNG exists.

The same goes for `"ww2:m1_garand"` when it is passed to a function that expects an `entity`, where grug will check that there is a `ww2` mod that contains an `m1_garand` entity.

You might now think "But what if a mod needs a more complex data type, like a pointer, struct, or dynamic array"? The simple answer is that it is the game developer's responsibility to add functions for this.

So a modder might call `vector_string_create()`, which returns an `i32` ID, and is then used when calling `vector_string_push(id, "foo")` and `vector_string_get(id, index)`. Note how it is up to the game developer here to decide whether `index` is [0-based or 1-based](https://en.wikipedia.org/wiki/Zero-based_numbering).

The game developer *could* add a `vector_string_free(id)` function, but this is discouraged, as modders shouldn't be burdened with and counted on calling this function. grug might smell like C, but its goal is to be friendlier to newcomers.

Instead, the game developer should take the responsibility of freeing the vector, when there are no more references to it.

But since reference counting isn't always trivial to do, and since most mods don't actually need more complex data types, game developers are recommended to hold off on exposing memory allocating functions to modders.

### grug is stupidly easy to set up

The game developer only needs to drop `grug.c` into their existing project, which is a roughly 7500 line long file, and `grug.h`, which is under 100 lines long.

`grug.c` contains an entire compiler and linker, currently capable of outputting 64-bit ELF shared objects (which only runs on Linux), containing x86-64 instructions (which won't run on ARM CPUs).

Its GitHub repository is found [here](https://github.com/MyNameIsTrez/grug/).

I am currently in the process of writing games and non-games that show off grug.

Since most languages can either call functions from `grug.c` directly, or are able to load it as a library, grug can be used by almost every programming language under the sun.

In a nutshell, the game developer:

1. Periodically calls a function from `grug.c`, which will recompile any modified mods, and will store the modified mods in an array.
2. Loops over this array, and copies the data and functions from these modified mods into their own game.

So the game might have a `Gun` class, and the modified mod might up the firerate of the gun, and have a different <span style="color:#C3E88D">`on_fire`</span> function.

The "How a game developer might use grug" section of this blog post shows an example of how grug can be used by a game written in C.

## Runtime error handling

Every possible runtime crash in a grug file is caught.

In this video, look at the console at the bottom of the game for the possible runtime errors:
1. Division by 0
2. Functions taking too long, often caused by an accidental infinite loop (with Lua the game would hang!)
3. Stack overflow, often caused by recursing too deep

<video src="https://github.com/user-attachments/assets/3e9ae8ff-8e34-4d9f-90e6-f56ef909bc1a" width="100%" autoplay controls loop muted></video>

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

on_kill(self: i32, other: i32) {
    print_string(get_human_name(self))
    print_string(" killed ")
    print_string(get_human_name(other))
    print_string("\n") # Printing "\n" moves the console's cursor down
}
```

The <span style="color:#f07178">`define`</span> function adds a new <span style="color:#89ddff">`human`</span> variant to the game.

The <span style="color:#C3E88D">`on_kill`</span> function is called by the game whenever the zombie kills someone.

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

on_kill(self: i32) {
    kills = kills + 1

    if kills == 3 {
        helper_spawn_sparkles(self)
        kills = 0
    }
}

helper_spawn_sparkles(self: i32) {
    i: i32 = 0

    while i < 10 {
        x: i32 = get_human_x(self) + random(-30, 30)
        y: i32 = get_human_y(self) + random(-30, 30)

        spawn_particle("sprites/sparkle.png", x, y)

        i = i + 1
    }
}
```

The <span style="color:#82AAFF">`helper_spawn_sparkles`</span> function is a helper function, which the game can't call, but the <span style="color:#C3E88D">`on_`</span> functions in this file can.

## Documentation, security, and type checking in one

The game developer is responsible for maintaining a `mod_api.json` file, which declares which entities and game functions modders are allowed to call. This ensures that malicious modders have no way of calling functions that might compromise the security of the user. It also allows `grug.c` to catch any potential issues in mods, like passing an `i32` to a game function that expects a `string`.

The game developer can safely share `mod_api.json` with players, as it also functions as the game's mod API documentation. The optional work of writing and hosting a pretty website around this file, like a wiki, could then be left to the players.

The `mod_api.json` file can just be shipped sitting next to the game's executable, because even if the user uses it to declare the game function `exit()` exists, it doesn't matter, because grug will try to call the non-existent function `game_fn_exit()`.

This single screenshot shows all there is to it:

![image](https://github.com/user-attachments/assets/e7e866b1-f399-4458-86f2-bf3d7c8f8a84)

## Stability through hundreds of tests and fuzzing

[237 handwritten tests](https://github.com/MyNameIsTrez/grug-tests/tree/main) (at the time of writing) that run automatically on every commit using [GitHub Actions](https://github.com/features/actions), ensure that there are no bugs. The actions run the tests on Linux with [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) and [valgrind](https://valgrind.org/), which check for memory access bugs.

There are three test categories:

1. Error tests: `grug.c` should find an issue in a `.grug` file, like an unexpected character, and return a descriptive error message.
2. Runtime error tests: During the execution of an <span style="color:#C3E88D">`on_`</span> function there is a runtime error, like a division by 0, and a descriptive error message should be returned.
3. OK tests: All `.grug` files should be compiled and linked without any errors, and every single grug feature (statements, operators, etc.) is extensively tested for correctness.

[libFuzzer](https://llvm.org/docs/LibFuzzer.html) is a tool that is used to ensure that even the strangest and corrupt looking `.grug` files won't ever crash the game.

A fuzzer is basically a neural network that generates a random string, throws it into the fuzzed program, and gets a reward if it walked a new path through the fuzzed program's code. If it got a reward, it uses the knowledge that there is a good chance it'll get more rewards if it tries similar strings. In this manner it quickly finds most possible paths through the fuzzed program's code, also finding a few inputs that crashed `grug.c`, which I of course patched.

## How a game developer might use grug

The below snippets are based on the [grug terminal game repository](https://github.com/MyNameIsTrez/grug-terminal-game), so if anything confuses you, feel free to check out the full program.

Games typically have an update loop, so by calling `grug_regenerate_modified_mods()` in there you can tell grug to recompile any modified mods, where the function returns `true` if there was an error:

```bettercpp
int main() {
    bool initialized = false;

    while (true) {
        if (grug_regenerate_modified_mods()) {
            if (grug_error.has_changed) {
                printf(
                    "%s:%d: %s (detected in grug.c:%d)\n",
                    grug_error.path,
                    grug_error.line_number,
                    grug_error.msg,
                    grug_error.grug_c_line_number
                );
            }
            continue;
        }

        if (!initialized) {
            init();
            initialized = true;
        }

        reload_modified_entities();

        update();
    }
}
```

The call to `reload_modified_entities()` in the main function loops over all regenerated mods, reinitializing the tool's globals and using the new `on_` fns:

```bettercpp
void reload_modified_entities() {
    // For every reloaded grug file
    for (size_t reload_idx = 0; reload_idx < grug_reloads_size; reload_idx++) {
        struct grug_modified reload = grug_reloads[reload_idx];

        // For the player and opponent tools
        for (size_t i = 0; i < 2; i++) {

            // If the reloaded grug file has the same tool type
            if (reload.old_dll == data.tool_dlls[i]) {
                data.tool_dlls[i] = reload.new_dll;

                // Reinitialize the tool's globals
                free(data.tool_globals[i]);
                data.tool_globals[i] = malloc(reload.globals_size);
                reload.init_globals_fn(data.tool_globals[i]);

                // Use the new on fns
                data.tools[i].on_fns = reload.on_fns;
            }
        }
    }
}
```

The call to `init()` in the main function gives the player tool 0, and the opponent tool 1 from the `mods/` directory:

```bettercpp
struct tool tool_definition;

// This gets called by the define() function in grug mods
void game_fn_define_tool(string name, i32 damage) {
    tool_definition = (struct tool){
        .name = name,
        .damage = damage,
    };
}

static void pick_tool(size_t chosen_tool_index, size_t human_index) {
    struct grug_file *tool_files = get_type_files("tool");

    struct grug_file file = tool_files[chosen_tool_index];

    // This calls the grug file's define fn, which calls our game_fn_define_tool()
    file.define_fn();

    // The previous file.define_fn() line caused tool_definition to be filled
    tool tool = tool_definition;

    tool.on_fns = file.on_fns;

    data.tools[human_index] = tool;
    data.tool_dlls[human_index] = file.dll;

    // Initialize the tool's globals
    free(data.tool_globals[human_index]);
    data.tool_globals[human_index] = malloc(file.globals_size);
    file.init_globals_fn(data.tool_globals[human_index]);
}

void init() {
    pick_tool(0, PLAYER_INDEX);
    pick_tool(1, OPPONENT_INDEX);
}
```

Finally, the call to `update()` in the main function is the gameplay logic. The most important line is `use(player_tool_globals, PLAYER_INDEX);`, which calls the tool's `on_use()` grug function:

```bettercpp
static void update() {
    void *player_tool_globals = data.tool_globals[PLAYER_INDEX];
    void *opponent_tool_globals = data.tool_globals[OPPONENT_INDEX];

    tool *player_tool = &data.tools[PLAYER_INDEX];
    tool *opponent_tool = &data.tools[OPPONENT_INDEX];

    printf("You have %d health\n", player->health);
    printf("The opponent has %d health\n\n", opponent->health);

    printf("You use your %s against your opponent\n", player_tool->name);
    typeof(on_tool_use) *use = player_tool->on_fns->use;
    use(player_tool_globals, PLAYER_INDEX);

    if (opponent->health <= 0) {
        printf("The opponent died!\n");
        exit(0);
    }

    printf("The opponent uses their %s against the player\n", opponent_tool->name);
    use = opponent_tool->on_fns->use;
    use(opponent_tool_globals, OPPONENT_INDEX);

    if (player->health <= 0) {
        printf("You died!\n");
        exit(0);
    }
}
```

## Why grug

Like any good programming language, grug was born from frustration. Specifically, over 4 years of frustration keeping the configuration and Lua files of nearly 200 old Cortex Command mods up-to-date with the game.

The configuration language is a bespoke, cursed format that was only readable by the game's buggy parser. It required me to write a pretty complex tokenizer and parser, which I had to write many tests for, compared to if it had been say JSON.

And while I love Lua, it was the bane of the community's existence, as it resulted in an endless flood of mod bug reports in our Discord server. These were incredibly hard to find and fix (though we did our best), due to Lua's interpreted nature. If for example `gun.property_that_was_removed_from_the_game` was used in a mod, then it'd just evaluate to `nil`. Ideally this mod would refuse to run at all until the bug was fixed, like with any compiled language.

Maintaining these mods was a never-ending amount of work.

Lua was also way too complex for most people (since most gamers are not programmers), which meant more cool mods would have been made, had an even simpler scripting language been used.

grug is a stupidly simple configuration and scripting language that only allows mods to use simple functions that either act directly on the game's state, or act on "global" variables that are only visible to the functions in the same grug file (where Zombie 1 isn't able to access Zombie 2's global variables).

Base game content can also be turned into mods in this fashion, which even players who don't want to install mods will appreciate, as it will allow them to disable content that would have otherwise been hardcoded into the game.

## Future work

It is important to note that grug will still very much be a work in progress for the coming months.

I have many plans, but the biggest undertakings will be:
- Supporting Windows
- Supporting ARM
- Outputting debug symbols again, so that grug files can be stepped through with a debugger

For the time being you can try out the list of [small example programs](https://github.com/MyNameIsTrez/grug/?tab=readme-ov-file#small-example-programs). :-)
