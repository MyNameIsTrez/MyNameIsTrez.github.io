class Grid {
	constructor(cols, rows, layers, formulas, scene, geometry, material) {
		this.cols = cols;
		this.rows = rows;
		this.layers = layers;

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
		let x, y, z, cell;
		this.cells = [];
		for (let col = 0; col < this.cols; col++) {
			this.cells.push([]);
			// flip y-axis from top-bottom to bottom-top
			// for (let row = this.rows - 1; row >= 0; row--) {
			for (let row = 0; row < this.rows; row++) {
				this.cells[col].push([]);
				for (let layer = 0; layer < this.layers; layer++) {
					x = col;
					y = row;
					z = layer;

					cell = new Cell(x, y, z, col, row, layer, this.scene, this.geometry, this.material);
					this.cells[col][row].push(cell);
				}
			}
		}
	}

	setAliveCells() {
		let cell;
		for (let col = 0; col < this.cols; col++) {
			for (let row = 0; row < this.rows; row++) {
				for (let layer = 0; layer < this.layers; layer++) {
					cell = this.cells[col][row][layer];
					cell.determineAlive(this.formulas);
				}
			}
		}
	}

	drawAliveCells() {
		let cell;
		for (let col = 0; col < this.cols; col++) {
			for (let row = 0; row < this.rows; row++) {
				for (let layer = 0; layer < this.layers; layer++) {
					cell = this.cells[col][row][layer];
					cell.show();
				}
			}
		}
	}

	consoleLogCells() {
		let cellData, cell;
		const consoleCells = [];
		for (let col = 0; col < this.cols; col++) {
			consoleCells.push([]);
			for (let row = 0; row < this.rows; row++) {
				consoleCells[col].push([]);
				for (let layer = 0; layer < this.layers; layer++) {
					cell = this.cells[col][row][layer];
					cellData = {
						alive: cell.alive,
					}
					consoleCells[col][row].push(cellData);
				}
			}
		}
		console.log(JSON.stringify(consoleCells));
	}
}