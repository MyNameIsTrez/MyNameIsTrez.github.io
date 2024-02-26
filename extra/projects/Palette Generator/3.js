function setup() {
	// FEEL FREE TO EDIT THESE VALUES
	const w = 5 // Width of the grid
	const h = 4 // Height of the grid
	const points = 5 // Points on the grid





	const w_side = innerWidth / w
	const h_side = (innerHeight - 1) / h
	const side = w_side > h_side ? h_side : w_side

	createCanvas(w * side, h * side)
	background(40)
	noStroke()

	const start_time = performance.now()
	const {
		best_arr
	} = get_best_array(w, h, points)
	const end_time = performance.now()

	draw_squares(best_arr, w, h, side)

	textSize(50)
	textAlign(CENTER, CENTER)
	fill(255)
	text(`${(2 ** (w * h)).toLocaleString()} scanned states`, width / 2, height / 2 - 30)
	text(`in ${round(end_time - start_time)} ms`, width / 2, height / 2 + 30)
}


function get_best_array(w, h, points) {
	const positions = w * h // total bit count
	const k = points // number of bits set to 1

	let best_dist, best_bin
	for (let x = (1 << points) - 1; (x >>> positions) == 0; x = nextCombo(x)) {
		// console.log("foo")
		const bin = x.toString(2)

		const returned = get_best(bin, w, best_dist)
		if (typeof (returned) === "object") {
			best_dist = returned.best_dist
			best_bin = returned.best_bin
		}
	}

	let best_arr = []
	for (let i = 0; i < best_bin.length; i++) {
		const bit = best_bin.charAt(best_bin.length - i - 1)
		if (bit === "1") {
			const x = i % w
			const y = Math.floor(i / w)
			best_arr.push([x, y])
		}
	}

	return {
		best_arr
	}
}


// https://stackoverflow.com/a/10838990/13279557
// It only works for n <= 64 because it uses the bits of a JS number,
// but you can maybe increase it with a library that provides big integers.
function nextCombo(x) {
	// moves to the next combination with the same number of 1 bits
	const u = x & (-x)
	const v = u + x
	return v + (((v ^ x) / u) >> 2)
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