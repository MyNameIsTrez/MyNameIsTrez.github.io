class Grid {
	constructor(cols, rows, size, formulas, scene, geometry, material) {
		this.cols = cols;
		this.rows = rows;
		this.size = size;

		this.formulas = formulas;

		this.scene = scene;
		this.geometry = geometry;
		this.material = material;
	}

	// drawGridLines() {
	// 	for (let col = 0; col < this.cols; col++) {
	// 		const x1 = col * this.size;
	// 		const y1 = 0;
	// 		const x2 = x1;
	// 		const y2 = height;
	// 		line(x1, y1, x2, y2);
	// 	}

	// 	for (let row = 0; row < this.rows; row++) {
	// 		const x1 = 0;
	// 		const y1 = row * this.size;
	// 		const x2 = width;
	// 		const y2 = y1;
	// 		line(x1, y1, x2, y2);
	// 	}
	// }

	createCells() {
		this.cells = [];
		for (let col = 0; col < this.cols; col++) {
			this.cells.push([]);

			// flip y-axis from top-bottom to bottom-top
			for (let row = this.rows - 1; row >= 0; row--) {
				const x = col * this.size;
				const y = row * this.size;

				const cell = new Cell(x, y, col, row, this.scene, this.geometry, this.material);
				this.cells[col].push(cell);
			}
		}
	}

	setAliveCells() {
		for (let col = 0; col < this.cols; col++) {
			for (let row = 0; row < this.rows; row++) {
				const cell = this.cells[col][row];
				cell.determineAlive(this.formulas);
			}
		}
	}

	drawAliveCells() {
		for (let col = 0; col < this.cols; col++) {
			for (let row = 0; row < this.rows; row++) {
				const cell = this.cells[col][row];
				cell.show();
			}
		}
	}
}