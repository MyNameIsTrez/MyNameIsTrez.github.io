# Simple and fast circle packing with swap-remove

- Mention that C++ is used for the sake of comparing with set() and unordered_set()
- Mention that rand() is used which returns an int, which limits the area somewhat that depends on the size of an int on your system
- Using -O3
- Note that comparing times with the `time` command isn't going to be very accurate, but it's convenient.
- With both approaches filling the area is faster with a smaller radius.
- With the naive approach it fills an area faster with a smaller radius, apart from r10k
- With the swap-remove approach it often fills an area faster with a smaller radius
- Make table that compares naive vs set() vs unordered_set() vs swap-remove
- With the naive approach, the program is faster *with* the `!area[index]`
- `v2i` means value-to-index, and `i2v` means index-to-value
- Mention at the end that simulated annealing would be a simple upgrade
- Swap remove method doesn't need a 2D boolean array
- Swap-remove method is O(1) constant time, while naive method is O(TODO: ?) ... time
- TODO: Think of a name for swap_remove + yin-yang array pair Set technique
- A swap-remove array is essentially an unordered set with integer keys.

| w1k h1k i10 | r0   | r1   | r10  | r100 | r1k |
|-------------|------|------|------|------|-----|
| naive       | 5286 | 4644 | 2676 | 865  | 768 |
| swap-remove | 873  | 688  | 529  | 525  | 497 |
