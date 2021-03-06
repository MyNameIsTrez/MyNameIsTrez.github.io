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
	const w = 5 // Width of the grid
	const h = 4 // Height of the grid
	const points = 5 // Points on the grid

	// Before benchmarking was an option I'd get ~3290 ms for a 5x5 grid. Setting this to false gets ~3275 ms, so this has a very negligible/no impact on performance when turned off.
	const benchmarking = false





	const w_side = innerWidth / w
	const h_side = (innerHeight - 1) / h
	const side = w_side > h_side ? h_side : w_side

	createCanvas(w * side, h * side)
	background(40)
	noStroke()

	const start_time = performance.now()
	const {
		best_arr
	} = get_best_array(w, h, points, benchmarking)
	const end_time = performance.now()

	draw_squares(best_arr, w, h, side)

	textSize(50)
	textAlign(CENTER, CENTER)
	fill(255)
	text(`${(2 ** (w * h)).toLocaleString()} scanned states`, width / 2, height / 2 - 30)
	text(`in ${round(end_time - start_time)} ms`, width / 2, height / 2 + 30)
}


function get_best_array(w, h, points, benchmarking) {
	const positions = w * h

	let best_dist = 0

	let best_bin
	let returned
	let binary
	let bin
	let temp

	let t1_start, t2_start, t3_start, t4_start, t5_start
	let t1 = 0,
		t2 = 0,
		t3 = 0,
		t4 = 0,
		t5 = 0

	for (let dec = 0; dec < 2 ** positions; dec++) {
		if (benchmarking) t1_start = performance.now()

		// ALL BENCHMARKS ARE DONE WITH w = 5 AND h = 4

		// 3540 ms
		// const bin = dec.toString(2)
		// const result = bin.match(/1/g)
		// let one_count
		// if (result) {
		//   one_count = result.length
		// }

		// 1875 ms
		// const bin = dec.toString(2)
		// const one_count = bin.split('1').length - 1

		// 975 ms
		// const bin = dec.toString(2)
		// let one_count = 0
		// for (let i = 0; i < bin.length; i++) if (bin.charAt(bin.length - i - 1) === "1") one_count++

		// 180 ms
		// let dec_copy = dec
		// let one_count = 0
		// do {
		//   if (dec_copy & 1) {
		//     ++one_count
		//   }
		// } while (dec_copy >>= 1)

		// 145 ms
		// let dec_copy = dec
		// let one_count = 0
		// while (dec_copy) { 
		//     one_count += dec_copy & 1; 
		//     dec_copy >>= 1; 
		// }

		// 135 ms
		// https://stackoverflow.com/questions/15233121/calculating-hamming-weight-in-o1
		let dec_copy = dec
		dec_copy = dec_copy - ((dec_copy >> 1) & 0x55555555)
		dec_copy = (dec_copy & 0x33333333) + ((dec_copy >> 2) & 0x33333333)
		const one_count = ((dec_copy + (dec_copy >> 4) & 0xF0F0F0F) * 0x1010101) >> 24

		if (benchmarking) t1 += performance.now() - t1_start

		if (benchmarking) t2_start = performance.now()

		if (one_count !== points) continue

		if (benchmarking) t2 += performance.now() - t2_start

		if (benchmarking) t3_start = performance.now()

		// const bin = dec.toString(2)

		// 3287 ms of .toString(2) -> 3278 ms, so almost no performance boost
		bin = "";
		temp = dec;
		while (temp > 0) {
			if (temp % 2 == 0) {
				bin = "0" + bin;
			} else {
				bin = "1" + bin;
			}
			temp = Math.floor(temp / 2);
		}

		if (benchmarking) t3 += performance.now() - t3_start

		if (benchmarking) t4_start = performance.now()

		returned = get_best(bin, w, best_dist)
		if (typeof (returned) === "object") {
			best_dist = returned.best_dist
			best_bin = returned.best_bin
		}

		if (benchmarking) t4 += performance.now() - t4_start
	}

	if (benchmarking) t5_start = performance.now()

	let best_arr = []
	for (let i = 0; i < best_bin.length; i++) {
		const bit = best_bin.charAt(best_bin.length - i - 1)
		if (bit === "1") {
			const x = i % w
			const y = Math.floor(i / w)
			best_arr.push([x, y])
		}
	}

	if (benchmarking) t5 += performance.now() - t5_start

	if (benchmarking) console.log(`t1:${t1}\nt2:${t2}\nt3:${t3}\nt4:${t4}\nt5:${t5}`)

	return {
		best_arr
	}
}


function get_best(bin, w, best_dist) {
	let smallest_dist = Infinity
	let good_bin

	for (let j = 0; j < bin.length - 1; j++) {
		for (let k = 1; k < bin.length; k++) {
			if (j !== k) {
				const bit1 = bin.charAt(bin.length - j - 1)
				if (bit1 !== "1") continue
				const bit2 = bin.charAt(bin.length - k - 1)
				if (bit2 !== "1") continue

				const x1 = j % w
				const x2 = k % w
				const y1 = Math.floor(j / w)
				const y2 = Math.floor(k / w)

				const w_diff = x1 - x2
				const h_diff = y1 - y2
				const d = w_diff ** 2 + h_diff ** 2

				if (d < best_dist) return

				if (d < smallest_dist) {
					smallest_dist = d
					good_bin = bin
				}
			}
		}
	}

	if (smallest_dist > best_dist) {
		return {
			best_dist: smallest_dist,
			best_bin: good_bin
		}
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