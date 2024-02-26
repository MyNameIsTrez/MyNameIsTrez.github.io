class Ray {
	constructor(pos, degrees) {
		this.pos = pos;
		// Create a vector pointing in the direction of the angle.
		this.dir = p5.Vector.fromAngle(radians(degrees));
	}

	show() {
		// Draws the ray that doesn't hit the wall very short.
		push();
		stroke(255);
		translate(this.pos.x, this.pos.y);
		line(0, 0, this.dir.x * 10, this.dir.y * 10);
		pop();
	}

	lookAt(x, y) {
		this.dir.x = x - this.pos.x;
		this.dir.y = y - this.pos.y;
		this.dir.normalize();
	}

	cast(wall) {
		// Line segment of the wall.
		const x1 = wall.a.x;
		const y1 = wall.a.y;
		const x2 = wall.b.x;
		const y2 = wall.b.y;

		// Position of the ray.
		const x3 = this.pos.x;
		const y3 = this.pos.y;

		// Endpoint of the ray.
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;

		// The ray and boundary are parallel and thus never meet.
		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den == 0) {
			return;
		}

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

		if (t > 0 && t < 1 && u > 0) {
			// If there is an intersection, return the intersection point.
			return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
		} else {
			// If there isn't an intersection.
			return;
		}
	}
}