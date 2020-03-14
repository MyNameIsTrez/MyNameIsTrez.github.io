// Graphs values between 0 and 1.


let graph; // Global variable that transfers 'graph' from setup() to draw().


function setup() {
	createCanvas(innerWidth, innerHeight);
	frameRate(3);
	strokeWeight(8); // Sets the thickness of the graph lines.

	graph = new Graph(10); // Makes a graph with 10 columns.
}


function draw() {
	background(30);

	graph.add(random()); // 'random()' returns a random number from 0 up to (but not including) 1.
	graph.show();
}


class Graph {
	constructor(colsCount) {
		this.colsCount = colsCount;

		this.data = [];

		this.xBottomLeft = width / 4;
		this.yBottomLeft = height / 4 * 3;
		this.xTopRight = width / 4 * 3;
		this.yTopRight = height / 4;

		this.colWidth = (this.xTopRight - this.xBottomLeft) / this.colsCount;
		this.rowHeight = this.yTopRight - this.yBottomLeft;
	}

	add(n) {
		this.data.push(n);

		if (this.data.length > this.colsCount) {
			this.data.shift(); // Removes index 0, so the oldest number.
		}
	}

	show() {
		for (let i = 0; i < this.data.length - 1; i++) {
			const d1 = this.data[i];
			const d2 = this.data[i + 1];
			const diff = d2 - d1;

			if (d2 > d1) {
				stroke(50, 200, 50); // Green.
			} else if (d2 < d1) {
				stroke(200, 50, 50); // Red.
			} else { // When d1 and d2 are equal.
				stroke(50, 50, 200); // Blue.
			}

			// fill(255);

			const x1 = this.xBottomLeft + i * this.colWidth;
			const h1 = d1 * this.rowHeight;
			const y1 = this.yBottomLeft + h1;

			const x2 = this.xBottomLeft + (i + 1) * this.colWidth;
			const h2 = d2 * this.rowHeight;
			const y2 = this.yBottomLeft + h2;

			line(x1, y1, x2, y2);
		}
	}
}