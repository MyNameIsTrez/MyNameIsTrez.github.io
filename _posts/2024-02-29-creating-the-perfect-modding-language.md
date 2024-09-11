---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 12:00:00 +0100
---

The article [Video game modding](https://en.wikipedia.org/wiki/Video_game_modding) on Wikipedia describes modding pretty well:

> Video game modding (short for "modification") is the process of alteration by players or fans of one or more aspects of a video game, such as how it looks or behaves, and is a sub-discipline of general modding. Mods may range from small changes and tweaks to complete overhauls, and can extend the replay value and interest of the game.

Mods and plugins are the same thing, though the word "mod" is normally used by games. I say "mod", but my modding language's goal is to work for any application written in any programming language, so not just games.

grug is the name of my modding (programming) language, and its name is based on the legendary article [The Grug Brained Developer](https://grugbrain.dev/):

<video src="https://github.com/user-attachments/assets/4e2f0304-e392-4b98-be7d-e0d2802dde52" width="100%" autoplay controls loop muted></video>

## complexity _very_, _very_ bad

<img src="https://github.com/user-attachments/assets/2d67d359-8d13-4d38-92cf-8eb646a300aa" width="150" align="right" />

grug was designed from the ground up to make the development of mods as easy as possible.

It was designed alongside the writing of this article, and is based on two modding observations:

1. Most mods just want to add basic content, like more guns and creatures
2. Most mods just want to run some basic code whenever a common event happens, like having a human spawn three explosions when they die

The game developer only needs to drop `grug.c` into their existing project, which is a roughly 7500 line long file, and `grug.h`, which is under 100 lines long. It contains an entire compiler and linker, currently capable of outputting 64-bit ELFs (so no Windows, just Linux), containing x86-64 instructions (so no ARM). Its GitHub repository is found [here](https://github.com/MyNameIsTrez/grug/).

I am currently in the process of writing games and non-games that show off grug. Since most languages can either call functions from `grug.c` directly, or are able to load it as a library, grug can be used by almost every programming language under the sun. The "How a game developer might use grug" section of this blog post shows an example of how grug can be used by a game written in C.

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

## Documentation and type checking in one

The game developer maintains a `mod_api.json` file, so that grug.c can verify whether mods are doing stuff correctly.

The game developer can safely share `mod_api.json` with players, as it also functions as the game's mod API documentation. The optional work of writing and hosting a pretty website around this file, like a wiki, could then be left to the players.

This single screenshot encapsulates all there is to it:

![image](https://github.com/user-attachments/assets/e7e866b1-f399-4458-86f2-bf3d7c8f8a84)

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
