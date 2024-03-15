---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 12:00:00 +0100
---

Inspired by the wise words of grug from the legendary article [The Grug Brained Developer](https://grugbrain.dev/):

# complexity _very_, _very_ bad

I'm very aware how pretentious I can come across by calling something that I created "perfect", but I hope that I will be able to get across why it is perfect to _me_, and _for my specific criteria_.

grug is a modding language that was designed and created alongside the writing of this article, and is founded on two modding observations:

1. Most mods just want to add basic content, like more guns and creatures
2. Most mods just want to run some basic code whenever a common event happens, like having an actor spawn three explosions when they die

# grug example

Here's a `zombie.grug` file that a mod might have:

```grug
define_human() human {
	return {
		.name = "Zombie",
		.price = 50,
		.left_arm.health = 1,
		.right_leg.health = 2,
		.sprite_path = "zombie.png",
	}
}

on_human_death(self: human) {
	printf("Graaaaahhhh...\n") ; \n moves the terminal's cursor down a line
	printf("%s died!\n", self.name) ; %s gets replaced with "Zombie"
}
```

The <span style="color:#f07178">red</span> `define_human` function instructs the game to add a new `human` variant.

The <span style="color:#C3E88D">green</span> `on_human_death` function is called by the game whenever the zombie dies. The game can expose as many `on_` event functions as it desires.

That same mod can then add a `marine.grug` file, which can define its own `on_human_death` function:

```grug
define_human() human {
	return {
		.name = "Marine",
		.price = 420,
		.left_arm.health = 5,
		.right_leg.health = 7,
		.sprite_path = "marine.png",
	}
}

on_human_death(self: human) {
	my_name: string = "John"
	printf("%s died!\n", my_name)
}

on_human_war_cry(self: human) {
	i: i32 = 0
	pixel_radius: f64 = 50

	loop {
		; In the first loop any human within 50px of self.pos is returned,
		; in the second loop the next human, and so on
		hr: human_result = get_human_in_radius(self.pos, i, pixel_radius)

		; Stop looping once we've iterated over all humans in the radius
		if hr.finished_iterating {
			break
		}

		; We don't want to damage our own limbs
		if hr.human.id == self.id {
			continue
		}

		damage_human_limbs(hr.human)

		i = i + 1
	}
}

damage_human_limbs(human: human) {
	; These game functions can be hardcoded
	; to explode the limb when it drops below 0 health
	add_health_to_human_left_arm(human.id, -4)
	add_health_to_human_right_leg(human.id, -5)
}
```

The <span style="color:#82AAFF">blue</span> `damage_human_limbs` function is a helper function, which the game can't call, but the `define_` or `on_` functions in this file can.

The game developer gets to choose which things they want to expose to their modders, and it's done by creating a single `mod.h` header like the one below. grug also uses this header to detect mods trying to use something that was not exposed to them.

```bettercpp
#pragma once

#include <stdint.h> // int32_t
#include <stdbool.h> // bool

int printf(const char *format, ...);

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

struct human define_human();

void on_human_death(struct human self);
void on_human_war_cry(struct human self);

struct human_result {
	bool finished_iterating;
	struct human human;
};
struct human_result get_human_in_radius(struct pos center, i32 index, f64 radius);

void add_health_to_human_left_arm(i32 human_id, f64 health);
void add_health_to_human_right_leg(i32 human_id, f64 health);
```

# Why grug

Like any good programming language, grug was born from frustration. Specifically, my years of frustration keeping the configuration and Lua files of nearly 200 old Cortex Command mods up-to-date with the game.

The configuration language is a bespoke, cursed format that was only readable by the game's buggy parser, and required me to write a pretty complex tokenizer and parser with many tests for my mod converter, compared to if it had been say JSON.

And while I love Lua, it was the bane of the community's existence, as it resulted in an endless flood of hundreds of mod bug reports in our Discord server. These were incredibly hard to find and fix (though we all did our best), due to Lua's interpreted nature of for example printing `nil` if a player happened to use a specific gun that ran `print(gun.property_that_was_removed_from_the_game)`. Ideally this mod would refuse to run at all until the bug was fixed, like with any compiled language.

All in all, maintaining these mods for the community was an unnecessarily ridiculous amount of work.

Lua was also way too complex for most people, which created a stark divide between those who only used the configuration language, and those who also used Lua, which meant a lot of potential creative expression was lost solely due to the game using Lua for mod scripting.

grug is able to be a stupidly simple language mainly because it doesn't allow mods to create global state, and because it only allows `on_` event handling functions to run on things `define_`d in the same file. grug is just a basic configuration and scripting language that only allows mods to use simple functions that act directly on the game's state.

Base game content can also be turned into mods in this fashion, which even players who don't want to install mods will appreciate, as it will allow them to disable content that would have otherwise been hardcoded into the game.

grug is still in development, but this blog post will eventually contain a link to a new blog post that will explain how you can install and integrate grug into your game.

These are the main points that grug focuses:

- Robust, which is an automatic benefit of compiled languages, making it hard for bugs to silently creep in across game updates
- Simple, by trimming most features from C, and forcing grug files to be completely independent of one another
- Stateless, by only allowing mods to mutate the game's state
- Pointerless, by not allowing mods to use `*` nor `->` to dereference pointers, which makes it super clear that if a mod wants to change any game value, it can only be done by calling an exposed setter function
- Secure, by having the game developer explicitly expose functions, and not allowing mods to access arbitrary memory using pointers
- Easy to integrate, since grug is directly translatable to C, and the [Tiny C Compiler](https://en.wikipedia.org/wiki/Tiny_C_Compiler) comes with the `grug.c` and `grug.h` files, with no further dependencies
- Hot reloadable scripting language, by having the modder create `on_` event handling functions for every single event they want their thing to listen to
- Hot reloadable configuration language, by having the modder create one `define_` function per grug file that fills and returns one of the game's structs
- Mods are holy tests, because if any mod from the mod repository stops compiling after some change to the game, it is the responsibility of the game developer who made the change to either push a new commit that fixes the issue in the game engine, or to apply a program on the mods that automatically updates them so they do compile

![F6BJmvMaEAAVU4S](https://github.com/MyNameIsTrez/MyNameIsTrez.github.io/assets/32989873/8af20dd2-6ed2-4c0d-8e16-62397597283c)

# Technical deep dive

See my next blog post, [Technical deep dive into grug]({{ site.baseurl }} {% link _posts/2024-03-04-technical-deep-dive-into-grug.md %}).
