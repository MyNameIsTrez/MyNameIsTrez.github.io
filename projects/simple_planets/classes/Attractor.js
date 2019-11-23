class Attractor {
	constructor(x, y, r, m) {
		this.pos = createVector(x, y);
		this.radius = r;
		this.mass = m;
	}

	show(color = attractorColor) {
		// circle
		noStroke();
		if (color === backgroundColor) { // when removing an attractor with the path particle effect
			fill(color);
			circle(this.pos.x, this.pos.y, this.radius + 2);
		} else {
			for (let alpha = 1; alpha < 20; alpha += 1) {
				fill(color[0], color[1], color[2], alpha);
				circle(this.pos.x, this.pos.y, this.radius - alpha * 4);
			}
		}
	}
}
