class Particle {
	constructor(x, y, r, m) {
		this.pos = createVector(x, y);
		this.prevPos = createVector(x, y);
		// this.vel = createVector();
		this.vel = p5.Vector.random2D(); // prevents all particles having the same x and y values in the simulation
		this.vel.setMag(random(0.1 * magMult, 1 * magMult)); // prevents the particles from forming a ring
		this.acc = createVector();

		this.radius = r;
		this.mass = m;
		this.color = [round(random(255)), round(random(255)), round(random(255)), alpha];
	}

	update() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}

	show() {
		// circle
		strokeWeight(this.radius);
		if (colors) {
			stroke(this.color);
		} else {
			stroke(255, alpha);
		}
		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

		if (directionVectors) {
			showDirectionVectors(this);
		}
	}

	attracted(target, attractorCollisions) {
		const force = p5.Vector.sub(target.pos, this.pos); // target.pos - this.pos
		if (attractorCollisions) {
			const dist = sqrt(force.x * force.x + force.y * force.y);
			if (dist <= this.radius + target.radius) {
				return true; // destroy this particle
			}
		}
		const distanceSquared = force.magSq();
		const strength = constrain(G * ((this.mass * target.mass) / (distanceSquared / distanceMult)), 0, constraint);
		force.setMag(strength); // sets the vector's length
		// force.mult(-1); // make the attractors repellers
		this.acc.add(p5.Vector.div(force, this.mass)); // F = m * a, a = F / m
	}
}

function showDirectionVectors(particle) {
	// middle of the velocity vector
	const xVel = particle.pos.x + particle.vel.x * direcVecMult * 10;
	const yVel = particle.pos.y + particle.vel.y * direcVecMult * 10;
	stroke(255, 0, 0);
	line(particle.pos.x, particle.pos.y, xVel, yVel);

	// left side of the velocity vector arrow
	push();
	translate(xVel, yVel);
	rotate(10);
	line(0, 0, particle.vel.x * direcVecMult, particle.vel.y * direcVecMult);
	pop();

	// right side of the velocity vector arrow
	push();
	translate(xVel, yVel);
	rotate(-10);
	line(0, 0, particle.vel.x * direcVecMult, particle.vel.y * direcVecMult);
	pop();


	// middle of the acceleration vector
	const xAcc = particle.pos.x + particle.acc.x * direcVecMult * 500;
	const yAcc = particle.pos.y + particle.acc.y * direcVecMult * 500;
	stroke(0, 0, 255);
	line(particle.pos.x, particle.pos.y, xAcc, yAcc);

	// left side of the acceleration vector arrow
	push();
	translate(xAcc, yAcc);
	rotate(10);
	line(0, 0, particle.acc.x * direcVecMult * 100, particle.acc.y * direcVecMult * 100);
	pop();

	// right side of the acceleration vector arrow
	push();
	translate(xAcc, yAcc);
	rotate(-10);
	line(0, 0, particle.acc.x * direcVecMult * 100, particle.acc.y * direcVecMult * 100);
	pop();
}
