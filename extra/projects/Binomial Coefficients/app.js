// Fast way of finding n choose k
// https://en.wikipedia.org/wiki/Binomial_coefficient#Binomial_coefficient_in_programming_languages

binomialGrid();
binomialLarge();

function binomialGrid() {
	console.log("Binomial grid:");
	let str = "";
	for (let n = 1; n <= 10; n++) {
		for (let k = 1; k <= 5; k++) {
			str += binomialCoeff(n, k).toString();
			if (k < 5) str += ", ";
		}
		if (n < 10) str += "\n";
	}
	console.log(str);
}

function binomialLarge() {
	const n = 256 ** 3;
	const k = 94;

	const time_start = performance.now();
	const coeff = binomialCoeff(n, k).toString();
	console.log(`\nLarge binomial: ${performance.now() - time_start} ms`);

	console.log(strToScientific(coeff));
}

function binomialCoeff(n, k) {
	if (k < 0 || k > n) return 0;
	if (k === 0 || k === n) return 1;
	k = Math.min(k, n - k); // Takes advantage of symmetry.
	let c = 1n;
	n = BigInt(n);
	for (let i = 0n; i < k; i++) c = c * (n - i) / (i + 1n);
	return c;
}

function strToScientific(coeff) {
	return coeff.slice(0, 1) + "." + coeff.slice(1) + "e" + coeff.length;
}