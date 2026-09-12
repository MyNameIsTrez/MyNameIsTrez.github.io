---
layout: post
title: "Why I'm considering removing `continue` from grug"
date: 2026-08-28 12:00:00 +0100
---

### Background

I added the `continue` keyword ~2 years ago as an experiment. I knew from the start that it might be removed eventually, aligning with the philosophy of minimalist scripting languages (e.g., [Lua doesn't have `continue` either](https://stackoverflow.com/questions/3524970/why-does-lua-have-no-continue-statement)).

I am making the call to remove it now because I just ran into the exact footgun it creates for the umpteenth time while writing Minecraft mod logic.

### The Problem: Deep Nesting

It starts with perfectly correct, but deeply nested code. Here is the [original working version of my autocrafting logic](https://github.com/grug-lang/grug-for-minecraft/blob/0891c8a66c970b51de19c58eaa7d31eee9febe9b/src/main/resources/default_grug_mods/buildcraft/autocrafting_table_entity-BlockEntity.grug#L55). Because grug deliberately lacks `for` loops, this is a lot of indentation to look at:

```grug
local _can_restock_all() bool {
    slot: number = 0
    while slot < 9 {
        if get_item_count_in_slot(me, slot) == 1 {
            item_opt: Option[Item] = get_item_in_slot(me, slot)
            if item_opt.has() {
                item: Item = item_opt.unwrap()

                damage: number = get_item_damage_in_slot(me, slot)
                required: number = 0

                # Count how many of this exact item are needed across the whole grid
                inner_slot: number = 0
                while inner_slot < 9 {
                    if get_item_count_in_slot(me, inner_slot) == 1 {
                        inner_opt: Option[Item] = get_item_in_slot(me, inner_slot)
                        if inner_opt.has() {
                            is_same_item: bool = equals(inner_opt.unwrap(), item)
                            is_same_damage: bool = get_item_damage_in_slot(me, inner_slot) == damage

                            if is_same_item and is_same_damage {
                                required = required + 1
                            }
                        }
                    }
                    inner_slot = inner_slot + 1
                }

                # If neighbors don't have enough, abort the whole restock
                if _count_in_neighbors(item, damage) < required {
                    return false
                }
            }
        }
        slot = slot + 1
    }

    return true
}
```

### The Footgun: The `continue` Trap

To reduce that indentation, the natural instinct of a developer is to use guard clauses with early exits. I refactored the code into this version, **which is broken and causes a Time Limit Exceeded runtime error:**

```grug
local _can_restock_all() bool {
    slot: number = 0
    while slot < 9 {
        if get_item_count_in_slot(me, slot) == 1 {
            item_opt: Option[Item] = get_item_in_slot(me, slot)
            if not item_opt.has() {
                # THE BUG: This skips the rest of the loop block!
                continue
            }
            item: Item = item_opt.unwrap()

            damage: number = get_item_damage_in_slot(me, slot)
            required: number = 0

            # Count how many of this exact item are needed across the whole grid
            inner_slot: number = 0
            while inner_slot < 9 {
                if get_item_count_in_slot(me, inner_slot) == 1 {
                    inner_opt: Option[Item] = get_item_in_slot(me, inner_slot)
                    if inner_opt.has() {
                        is_same_item: bool = equals(inner_opt.unwrap(), item)
                        is_same_damage: bool = get_item_damage_in_slot(me, inner_slot) == damage

                        if is_same_item and is_same_damage {
                            required = required + 1
                        }
                    }
                }
                inner_slot = inner_slot + 1
            }

            # If neighbors don't have enough, abort the whole restock
            if _count_in_neighbors(item, damage) < required {
                return false
            }
        }
        # ... BECAUSE IT JUMPED, IT NEVER REACHES THIS LINE:
        slot = slot + 1
    }

    return true
}
```

The bug? I forgot to put `slot = slot + 1` immediately before the `continue`. Because it skipped the increment, the loop evaluated the same slot infinitely. Even if I had remembered the increment, the resulting function was still overwhelming to read.

### The Grug Way

Removing `continue` forces developers into the "[pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/)". The *actual* intended way to refactor code in grug is to split nested logic into local helper functions.

Here is what the code looks like when forced to extract the inner loop, completely eliminating the need for `continue` while making it highly readable:

```grug
local _can_restock_all() bool {
    slot: number = 0
    while slot < 9 {
        if get_item_count_in_slot(me, slot) == 1 {
            item_opt: Option[Item] = get_item_in_slot(me, slot)
            if item_opt.has() {
                item: Item = item_opt.unwrap()

                damage: number = get_item_damage_in_slot(me, slot)
                required: number = _count_required(item, damage)

                # If neighbors don't have enough, abort the whole restock
                if _count_in_neighbors(item, damage) < required {
                    return false
                }
            }
        }
        slot = slot + 1
    }

    return true
}

local _count_required(target_item: Item, target_damage: number) number {
    required: number = 0
    slot: number = 0

    while slot < 9 {
        if get_item_count_in_slot(me, slot) == 1 {
            item_opt: Option[Item] = get_item_in_slot(me, slot)
            if item_opt.has() {
                is_same_item: bool = equals(item_opt.unwrap(), target_item)
                is_same_damage: bool = get_item_damage_in_slot(me, slot) == target_damage

                if is_same_item and is_same_damage {
                    required = required + 1
                }
            }
        }
        slot = slot + 1
    }

    return required
}
```

### What about `break`?

The `break` keyword will stay. Unlike `continue`, `break` doesn't have a major footgun. While not strictly essential for performance, since developers can always extract a search loop into a helper function to `return` early, keeping `break` reduces the need for these splits. This preserves [Locality of Behaviour](https://htmx.org/essays/locality-of-behaviour/) and makes it easier to write performant code immediately, like stopping an inventory search the moment a target item is found:

```grug
slot: number = 0
diamond_slot: number = -1

while slot < 27 {
    if _is_diamond(me, slot) {
        diamond_slot = slot
        break
    }
    slot = slot + 1
}
```

### The `continue` keyword is still nice for iterators

```grug
files_it: Iterator[File] = files("textures/legs")

while files_it.iterating() {
    file: File = files_it.iteration()
    name: string = file.name()

    if (name == ".") or (name == "..") {
        continue
    }

    if starts_with(name, "some_very_long_string") {
        continue
    }

    _foo(file)
}
```
