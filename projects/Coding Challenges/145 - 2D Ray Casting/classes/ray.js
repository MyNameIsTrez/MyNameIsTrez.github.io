class Ray {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.dir = createVector(1, 0);
	}

	show() {
		push();
		stroke(255);
		translate(this.pos.x, this.pos.y);
		line(0, 0, this.dir.x * 10, this.dir.y * 10);
		pop();
	}
}