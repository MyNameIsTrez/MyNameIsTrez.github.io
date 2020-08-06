/*
Let's say you have a 2x3 grid with 4 points:

It counts from 0 to 2^(2*3) -> 2^6 -> 64, which is quite close to the 55 (way cheaper) checks of the 1st version.
This version suffers from being way slower for larger grid sizes as it's O(2^(w*h)), but it has the advantage that the amount of time it takes to calculate the optimal answer isn't influenced by the number of points. This means that the grid size is the only factor influencing the time it takes this algorithm to finish.

This program takes 34 seconds to calculate the optimal arrangement of 5 points in a 5x5 grid, which is really slow compared to the 0.13 seconds it takes the 1st version to do the same.

It takes so long, because 2^(5*5) -> 2^25, which is equal to 33,554,432 expensive checks, while 2^(5*4) -> 2^20, which is only equal to 1,048,576 expensive checks.

It converts the number (let's say it's at 50) to binary, which is represented in the form of a string. It then counts how often the number `1` is found in that binary string and checks if it's equal to the number of points, so 4 in this case. If this is not the case, it continues to the number 51.

The `w` value is used to split the binary string into a 2D array. The distances between the `1` characters in the 2D array are calculated with Pythagoras' theorem (a^2 + b^2 = c^2) to get the smallest distance. If that smallest distance is larger than the smallest distance of all previous 2D arrays, it overwrites a previously saved 'best' 2D array. The 'best' array is finally drawn on the screen.
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
		best_arr,
		possibilities
	} = get_best_array(points, w, h)
	const end_time = Date.now()

	draw_squares(best_arr, w, h, side)

	textSize(50)
	textAlign(CENTER, CENTER)
	fill(255)
	text(`${possibilities.toLocaleString()} potential states`, width / 2, height / 2 - 30)
	text(`in ${end_time - start_time} ms`, width / 2, height / 2 + 30)
}


function get_best_array(points, w, h) {
	const positions = w * h

	let best_dist = 0
	let best_arr

	let possibilities = 0
	for (let dec = 0; dec < 2 ** positions; dec++) {
		const bin = dec.toString(2)

		let one_count = 0
		for (let i = 0; i < bin.length; i++) if (bin.charAt(bin.length - i - 1) === "1") one_count++

		possibilities++

		if (one_count !== points) continue

		let arr = []
		for (let i = 0; i < bin.length; i++) {
			const bit = bin.charAt(bin.length - i - 1)
			if (bit === "1") {
				const x = i % w
				const y = Math.floor(i / w)
				arr.push([x, y])
			}
		}

		let smallest_dist = Infinity
		for (let j = 0; j < arr.length - 1; j++) {
			const xy1 = arr[j]
			for (let k = 1; k < arr.length; k++) {
				if (j !== k) {
					const xy2 = arr[k]

					const w_diff = xy1[0] - xy2[0]
					const h_diff = xy1[1] - xy2[1]
					const d = w_diff ** 2 + h_diff ** 2
					if (d < smallest_dist) smallest_dist = d
				}
			}
		}

		if (smallest_dist > best_dist) {
			best_dist = smallest_dist
			best_arr = arr
		}
	}

	return {
		best_arr,
		possibilities
	}
}


function draw_squares(best_arr, w, h, side) {
	for (const [x, y] of best_arr) {
		const r = (x + 1) / w * 255
		const g = (y + 1) / h * 255
		fill(r, g, 127)
		square(x * side, y * side, side)
	}
}