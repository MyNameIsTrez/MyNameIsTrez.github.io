/*
Let's say you have a 2x3 grid with 4 points:

It'll take 55 cheap checks to calculate the optimal arrangement of points, which is less than the 64 checks it'd take the 2nd version. The downside of this algorithm is that the amount of time it takes to calculate the optimal answer is heavily influenced by the number of points. This means that the grid size isn't the only factor influencing the time it takes this algorithm to finish, unlike the 2nd version where only the grid size matters.

This program takes 0.13 seconds to calculate the optimal arrangement of 5 points in a 5x5 grid, which is really fast compared to the 34 seconds it takes the 2nd version to do the same.

An array is made with 2*3 -> 6 booleans in it, where the first 4 booleans are `true` and the rest are `false`:
`[true, true, true, true, false, false]`

It then keeps shifting the `true` to the right, in a way that's similar to counting in binary:
`[true, true, true, false, true, false]`
`[true, true, true, false, false, true]`
`[true, true, false, true, true, false]`
When no `true` can be shifted to the right anymore, the program is done:
`[false, false, true, true, true, true]`

For every array that's created when shifting:
The `w` value is used to split the 1D array of booleans into a 2D array. The distances between the booleans in the 2D array are calculated with Pythagoras' theorem (a^2 + b^2 = c^2) to get the smallest distance in the shifted array. If that smallest distance is larger than the smallest distance of all previous 2D arrays, it overwrites a previously saved 'best' 2D array. The 'best' array is finally drawn on the screen.
*/


function setup() {
	// FEEL FREE TO EDIT THESE VALUES
	const w = 5
	const h = 4
	const points = 5





	const w_side = innerWidth / w
	const h_side = (innerHeight - 1) / h
	const side = w_side > h_side ? h_side : w_side

	createCanvas(w * side, h * side)
	background(40)
	noStroke()

	const start_time = Date.now()
	const {
		xy_states,
		possibilities
	} = get_all_arrays(points, w, h)
	const best_arr = get_best_array(xy_states)
	const end_time = Date.now()

	draw_squares(best_arr, w, h, side)

	textSize(50)
	textAlign(CENTER, CENTER)
	fill(255)
	text(`${possibilities.toLocaleString()} potential states`, width / 2, height / 2 - 30)
	text(`in ${end_time - start_time} ms`, width / 2, height / 2 + 30)
}


function get_all_arrays(points, w, h) {
	const spaces = w * h

	let states = []
	let xy_states = []

	for (let i = 0; i < spaces; i++) states.push(i < points)

	xy_states.push(get_xy_state(states, spaces, w))
	let possibilities = 1

	let moved, prev_space_k
	do {
		moved = false
		prev_space_k = undefined

		for (let k = spaces - 1; k >= 0; k--) {
			possibilities++

			if (states[k] === true && prev_space_k === false) {
				states[k] = false
				states[k + 1] = true
				moved = true

				for (let l = k + 2; l < spaces; l++) {
					if (states[l] === false) {
						for (let m = l + 1; m < spaces; m++) {
							if (states[m] === true) {
								states[m] = false
								states[l] = true
								break
							}
						}
					}
				}
				xy_states.push(get_xy_state(states, spaces, w))
				break
			}
			prev_space_k = states[k]
		}
	} while (moved === true)

	return {
		xy_states,
		possibilities
	}
}


function get_xy_state(states, spaces, w) {
	let xy_state = []

	for (let x = 0; x < w; x++) xy_state[x] = []

	let x, y
	for (let i = 0; i < spaces; i++) {
		x = i % w
		y = Math.floor(i / w)
		xy_state[x][y] = states[i] // Using 0/1 instead might improve speed.
	}

	return xy_state
}


function get_best_array(xy_states) {
	let best_xy_state, smallest_dist
	let largest_dist = 0
	for (const xy_state of xy_states) {
		smallest_dist = get_smallest_dist(xy_state)
		if (smallest_dist > largest_dist) {
			largest_dist = smallest_dist
			best_xy_state = xy_state
		}
	}
	return best_xy_state
}


function get_smallest_dist(xy_state) {
	let states_coords = []
	for (let x = 0; x < xy_state.length; x++) {
		for (let y = 0; y < xy_state[0].length; y++) {
			if (xy_state[x][y] === true) states_coords.push({
				x,
				y
			})
		}
	}
	let smallest_dist = Infinity
	for (const state_coords of states_coords) {
		for (const other_state_coords of states_coords) {
			if (state_coords.x !== other_state_coords.x || state_coords.y !== other_state_coords.y) {
				const w_diff = state_coords.x - other_state_coords.x
				const h_diff = state_coords.y - other_state_coords.y
				const dist = w_diff ** 2 + h_diff ** 2
				if (dist < smallest_dist) smallest_dist = dist
			}
		}
	}
	return smallest_dist
}


function draw_squares(best_arr, w, h, side) {
	for (let x = 0; x < best_arr.length; x++) {
		for (let y = 0; y < best_arr[0].length; y++) {
			if (best_arr[x][y] === true) {
				const r = (x + 1) / best_arr.length * 255
				const g = (y + 1) / best_arr[0].length * 255
				fill(r, g, 127)
				square(x * side, y * side, side)
			}
		}
	}
}