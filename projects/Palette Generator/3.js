function setup() {
	// const dec = 7

	// Calculate n from dec. Try to stop the loop when dec has been reached.
	const n = 5 // bit count

	const k = 3 // 1 bits count

	for (let x = (1 << k) - 1; (x >>> n) == 0; x = nextCombo(x)) {
		console.log(x.toString(2))
	}
}

// https://stackoverflow.com/a/10838990/13279557
function nextCombo(x) {
	// moves to the next combination with the same number of 1 bits
	const u = x & (-x)
	const v = u + x
	return v + (((v ^ x) / u) >> 2)
}