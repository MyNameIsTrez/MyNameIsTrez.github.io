class Cell {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	draw() {
		push();
		image(sprites[this.type], this.x, this.y, cellW, cellH);
		pop();
	}
}