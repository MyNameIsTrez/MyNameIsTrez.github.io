---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 12:00:00 +0100
---

# complexity _very_, _very_ bad

<img src="https://github.com/user-attachments/assets/2d67d359-8d13-4d38-92cf-8eb646a300aa" width="150" align="right" />

These wise words from the legendary article [The Grug Brained Developer](https://grugbrain.dev/) captures the spirit of this modding language perfectly.

grug is a modding language that was designed and created alongside the writing of this article, and is founded on two modding observations:

1. Most mods just want to add basic content, like more guns and creatures
2. Most mods just want to run some basic code whenever a common event happens, like having an actor spawn three explosions when they die

# grug example

Here's a `zombie.grug` file that a mod might have:

```grug
define() human {
    return {
        .name = "Zombie",
        .price = 50,
        .left_arm.health = 1,
        .right_leg.health = 2,
        .sprite_path = "zombie.png",
    }
}

on_death(self: human) {
    print("A ")
    print(self.name)
    print(" died!\n") # \n moves the terminal's cursor down a line
}
```

The <span style="color:#f07178">`define`</span> function instructs the game to add a new <span style="color:#89ddff">`human`</span> variant.

The <span style="color:#C3E88D">`on_death`</span> function is called by the game whenever the zombie dies. The game can expose as many <span style="color:#C3E88D">`on_`</span> event functions as it desires.

That same mod can then add a `marine.grug` file, which can define its own <span style="color:#C3E88D">`on_death`</span> function:

```grug
define() human {
    return {
        .name = "Marine",
        .price = 420,
        .left_arm.health = 5,
        .right_leg.health = 7,
        .sprite_path = "marine.png",
    }
}

kills: i32 = 0

on_death(self: human) {
    print("A Marine died!\n")
}

on_kill(self: human) {
    kills = kills + 1

    if kills == 3 {
        helper_war_cry(self)
        kills = 0
    }
}

helper_war_cry(self: human) {
    i: i32 = 0
    pixel_radius: f64 = 50

    # This starts an infinite loop
    while true {
        # In the first loop any human within 50px of self.pos is returned,
        # in the second loop the next human, and so on
        hr: human_result = get_human_in_radius(self.pos, pixel_radius, i)

        # Stop looping once we've iterated over all humans in the radius
        if hr.finished_iterating {
            break
        }

        # We don't want to damage our own limbs
        if hr.human.id == self.id {
            continue
        }

        helper_damage_limbs(hr.human)

        i = i + 1
    }
}

helper_damage_limbs(human: human) {
    # These game functions can be hardcoded
    # to explode the limb when it drops below 0 health
    change_health_of_human_left_arm(human.id, -4)
    change_health_of_human_right_leg(human.id, -5)
}
```

The <span style="color:#82AAFF">`helper_damage_limbs`</span> function is a helper function, which the game can't call, but the <span style="color:#f07178">`define`</span> and <span style="color:#C3E88D">`on_`</span> functions in this file can.

The game developer gets to choose which things they want to expose to their modders, and it's done by creating a single `mod.h` header like the one below. grug also uses this header to detect mods trying to use something that was not exposed to them.

```bettercpp
#pragma once

#include <stdint.h> // int32_t
#include <stdbool.h> // bool

typedef double f64;
typedef int32_t i32;
typedef char* string;

struct pos {
    f64 x;
    f64 y;
};

struct limb {
    f64 health;
};

struct human {
    string name;
    i32 price;
    struct limb left_arm;
    struct limb right_leg;
    string sprite_path;

    // These should not be initialized by mods
    i32 id;
    struct pos pos;
};

struct human define_human(void);

void on_death(struct human self);
void on_kill(struct human self);

struct human_result {
    bool finished_iterating;
    struct human human;
};
struct human_result get_human_in_radius(struct pos center, f64 radius, i32 result_index);

void change_health_of_human_left_arm(i32 human_id, f64 health);
void change_health_of_human_right_leg(i32 human_id, f64 health);
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

![copy/paste is good meme](https://github.com/MyNameIsTrez/MyNameIsTrez.github.io/assets/32989873/8af20dd2-6ed2-4c0d-8e16-62397597283c)

# Technical deep dive

See my next blog post, [Technical deep dive into grug]({{ site.baseurl }} {% link _posts/2024-03-04-technical-deep-dive-into-grug.md %}).
