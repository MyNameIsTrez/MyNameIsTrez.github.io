---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 12:00:00 +0100
---

The article [Video game modding](https://en.wikipedia.org/wiki/Video_game_modding) on Wikipedia describes modding pretty well:

> Video game modding (short for "modification") is the process of alteration by players or fans of one or more aspects of a video game, such as how it looks or behaves, and is a sub-discipline of general modding. Mods may range from small changes and tweaks to complete overhauls, and can extend the replay value and interest of the game.

grug is the name of my modding (programming) language, and its name is based on the legendary article [The Grug Brained Developer](https://grugbrain.dev/):

<video src="https://github.com/user-attachments/assets/4e2f0304-e392-4b98-be7d-e0d2802dde52" width="100%" autoplay controls loop muted></video>

## complexity _very_, _very_ bad

<img src="https://github.com/user-attachments/assets/2d67d359-8d13-4d38-92cf-8eb646a300aa" width="150" align="right" />

grug was designed from the ground up to make the development of mods as easy as possible.

The game developer only needs to drop `grug.c` into their existing project, which is a 6782 line long file, containing an entire compiler and linker targeting ELF64 (Linux) on x86-64.

grug is a modding language that was designed alongside the writing of this article, and is founded on two modding observations:

1. Most mods just want to add basic content, like more guns and creatures
2. Most mods just want to run some basic code whenever a common event happens, like having a human spawn three explosions when they die

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

The game developer maintains a `mod_api.json` file, so that grug.c can verify whether modders are calling stuff correctly.

The game developer can safely share `mod_api.json` with players, as it also functions as very detailed mod API documentation. The optional work of writing and hosting a pretty website around this file, like a wiki, could then be left to the players.

The `"entities"` and `"game_functions"` keys in the below `mod_api.json` file are literally all there is to it:

![image](https://github.com/user-attachments/assets/e7e866b1-f399-4458-86f2-bf3d7c8f8a84)

## How a game developer might use grug

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

```bettercpp
void reload_modified_entities() {
    // For every reloaded grug file
    for (size_t reload_idx = 0; reload_idx < grug_reloads_size; reload_idx++) {
        struct grug_modified reload = grug_reloads[reload_idx];

        // For the player and opponent
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

        reload_modified_entities();

        if (!initialized) {
            init();
            initialized = true;
        }

        update();
    }
}
```

# Why grug

Like any good programming language, grug was born from frustration. Specifically, my years of frustration keeping the configuration and Lua files of nearly 200 old Cortex Command mods up-to-date with the game.

The configuration language is a bespoke, cursed format that was only readable by the game's buggy parser, and required me to write a pretty complex tokenizer and parser with many tests for my mod converter, compared to if it had been say JSON.

And while I love Lua, it was the bane of the community's existence, as it resulted in an endless flood of hundreds of mod bug reports in our Discord server. These were incredibly hard to find and fix (though we all did our best), due to Lua's interpreted nature of for example printing `nil` if a player happened to use a specific gun that ran `print(gun.property_that_was_removed_from_the_game)`. Ideally this mod would refuse to run at all until the bug was fixed, like with any compiled language.

All in all, maintaining these mods for the community was an unnecessarily ridiculous amount of work.

Lua was also way too complex for most people, which created a stark divide between those who only used the configuration language, and those who also used Lua, which meant a lot of potential creative expression was lost solely due to the game using Lua for mod scripting.

grug is a stupidly simple configuration and scripting language that only allows mods to use simple functions that either act directly on the game's state, or act on "global" variables that are only visible to the functions in the same grug file (where Zombie 1 isn't able to access Zombie 2's global variables).

Base game content can also be turned into mods in this fashion, which even players who don't want to install mods will appreciate, as it will allow them to disable content that would have otherwise been hardcoded into the game.

grug is still in development, but this blog post will eventually contain a link to a new blog post that will explain how you can install and integrate grug into your game.

# What sets grug apart

- Robust, which is an automatic benefit of compiled languages, making it hard for bugs to silently creep in across game updates
- Simple, by trimming most features from C, and forcing grug files to be completely independent of one another
- Stateless, by only allowing mods to mutate the game's state, which makes mods incredibly easy to debug
- Pointerless, by not allowing mods to use `*` nor `->` to dereference pointers, which makes it super clear to modders that the only way they can modify game values is by calling an exposed setter function
- Secure, by having the game developer explicitly expose functions, and not allowing mods to access arbitrary memory using pointers
- Easy to integrate, since grug is directly translatable to C, and the [Tiny C Compiler](https://en.wikipedia.org/wiki/Tiny_C_Compiler) comes in the `grug.c` and `grug.h` files, with no further dependencies
- Hot reloadable scripting language, by having the modder create <span style="color:#C3E88D">`on_`</span> event handling functions for every single event they want their thing to listen to
- Hot reloadable configuration language, by having the modder create one <span style="color:#f07178">`define`</span> function per grug file that fills and returns one of the game's structs
- Mods are holy tests, because if any mod from the mod repository stops compiling after some change to the game, it is the responsibility of the game developer who made the change to either push a new commit that fixes the issue in the game engine, or to apply a program on the mods that automatically updates them so they do compile

# Technical deep dive

See my next blog post, [Technical deep dive into grug]({{ site.baseurl }} {% link _posts/2024-03-04-technical-deep-dive-into-grug.md %}).
