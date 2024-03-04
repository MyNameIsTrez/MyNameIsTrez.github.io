---
layout: post
title: "Creating the perfect modding language"
date: 2024-02-29 00:00:00 +0100
---

Inspired by the wise words of grug from the legendary article [The Grug Brained Developer](https://grugbrain.dev/):

# complexity _very_, _very_ bad

I'm very aware how pretentious I can come across by calling something that I created "perfect", but I hope that I will be able to get across why it is perfect to *me*, and *for my specific criteria*.

grug is a modding language that was designed and created alongside the writing of this article, and is founded on two modding observations:
1. Most mods just want to add basic content, like more guns and creatures
2. Most mods just want to run some basic code whenever a common event happens, like having an actor spawn explosions when they die

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

on_death() {
	printf("Graaaaahhhh...\n")
}
```

The `on_death` function is called by the game whenever the zombie dies. The game can expose as many `on_` event functions as it desires.

That same mod can then add a `marine.grug` file, which can define its own `on_death` function:

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

on_death() {
	my_name: string = "John"
	printf("%s died!\n", my_name)
}

on_collision() {
	i: i32 = 0
	
	loop {
		# In the first loop the marine's first limb is returned,
		# and in the next loop the second
		lr: limb_result = get_limb(i)

		if lr.finished_iterating {
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

```c++
#pragma once

#include <stdint.h> // int32_t
#include <stdbool.h> // bool

int printf(const char *format, ...);

typedef double f64;
typedef int32_t i32;
typedef char* string;

void set_limb_health(i32 index, f64 health);

struct limb {
	f64 health;
};

struct human {
	i32 price;
	struct limb left_arm;
	struct limb right_leg;
	string sprite_path;
};

struct human define_human(void);

void on_death(void);
void on_collision(void);

struct limb_result {
	bool finished_iterating;
	string field_name;
	struct limb limb;
};

struct limb_result get_limb(i32 index);
```

# Why grug

grug is able to be a stupidly simple language mainly because it doesn't allow mods to store state, and because it only allows event handling functions to run on the thing that was defined in the same file. grug is just a basic configuration and scripting language that allows modders to create simple functions that act directly on the game's state.

Base game content can also be turned into mods in this fashion, which even players who don't want to install mods will appreciate, as it will allow them to disable content that would have otherwise been hardcoded into the game.

grug is still in development, but this blog post will eventually contain a link to a new blog post that will explain how you can install and use grug in your game.

Further points grug tries to focus on:

- Robust, which is an automatic benefit of compiled languages, making it hard for bugs to silently creep in across game updates
- Simple, by trimming most features from C
- Stateless, by only allowing mods to mutate the game's state
- Secure, by having the game developer explicitly expose functions
- Easy to integrate, since the grug compiler comes inside of a single `grug.c` and `grug.h` file
- Hot reloadable scripting language, by having the modder create `on_` event handling functions for every single event they want their thing to listen to
- Hot reloadable configuration language, by having the modder create one `define_` function per grug file that fills and returns one of the game's structs

![F6BJmvMaEAAVU4S](https://github.com/MyNameIsTrez/MyNameIsTrez.github.io/assets/32989873/8af20dd2-6ed2-4c0d-8e16-62397597283c)

# Technical deep dive

See my next blog post, [Technical deep dive into how grug works]({{ site.baseurl }} {% link _posts/2024-03-04-technical-deep-dive-into-how-grug-works.md %}).
