function setup() {
	const w = 5
	const h = 5
	const points = 5

	// Calculate n from dec. Try to stop the loop when dec has been reached.
	// const n = 25 // total bit count
	const n = w * h

	// const k = 3 // number of bits set to 1
	const k = points

	for (let x = (1 << k) - 1; (x >>> n) == 0; x = nextCombo(x)) {
		// console.log(x.toString(2))
		console.log("foo")
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