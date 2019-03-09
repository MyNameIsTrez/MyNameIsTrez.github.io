class Cell {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	draw() {
		image(sprites[this.type], this.x, this.y, cellWidth, cellHeight);
	}

	clicked() {
		if (firstCellType !== "empty") {
			this.type = "empty";
		} else {
			this.type = cellType;
		}
	}
}