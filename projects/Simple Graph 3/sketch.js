// Graphs values between 0 and 1.


let graph; // Global variable that transfers 'graph' from setup() to draw().


function setup() {
	createCanvas(innerWidth, innerHeight);
	frameRate(3);

	graph = new Graph(10); // Makes a graph with 10 columns.
}


function draw() {
	background(30);

	// 'random()' returns a random number from 0 up to (but not including) 1.
	graph.add(random());
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

			if (d2 > d1) {
				fill(50, 200, 50); // Green.
				stroke(50, 200, 50);
			} else if (d2 < d1) {
				fill(200, 50, 50); // Red.
				stroke(200, 50, 50);
			} else { // When d1 and d2 are equal (rare).
				fill(50, 50, 200); // Blue.
				stroke(50, 50, 200);
			}

			const w = this.colWidth;

			const x1 = this.xBottomLeft + i * w;
			const h1 = d1 * this.rowHeight;
			const y1 = this.yBottomLeft + h1;

			const x2 = this.xBottomLeft + (i + 1) * w;
			const h2 = d2 * this.rowHeight;
			const y2 = this.yBottomLeft + h2;

			let x3, y3, h;

			if (d2 > d1) {
				x3 = x2;
				y3 = y1;
				h = h1;
			} else {
				x3 = x1;
				y3 = y2;
				h = h2;
			}

			const x4 = x1;
			const y4 = this.yBottomLeft;

			triangle(x1, y1, x2, y2, x3, y3);

			rect(x4, y4, w, h);
		}
	}
}