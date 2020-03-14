// Graphs values between 0 and 1.


let graph; // Global variable that transfers 'graph' from setup() to draw().


function setup() {
	createCanvas(innerWidth, innerHeight);
	frameRate(3);
	noStroke(); // Removes the black edges.
	fill(255); // Makes the graph white.

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
		for (let i = 0; i < this.data.length; i++) {
			const x1 = this.xBottomLeft + i * this.colWidth;
			const y1 = this.yBottomLeft;
			const w = this.colWidth;
			const h = this.data[i] * this.rowHeight;

			rect(x1, y1, w, h);
		}
	}
}