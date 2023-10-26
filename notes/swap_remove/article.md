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

| w10k-h10k | naive | swap-remove |
|-----------|-------|-------------|
| r10       | 6.468 | 3.358       |
| r100      | 4.294 | 3.098       |
| r1k       | 8.303 | 6.839       |
| r10k      | 0.762 | 5.470       |

| w10k-h10k   | r10   | r100  | r1k   | r10k  |
|-------------|-------|-------|-------|-------|
| naive       | 6.468 | 4.294 | 8.303 | 0.762 |
| swap-remove | 3.358 | 3.098 | 6.839 | 5.470 |
