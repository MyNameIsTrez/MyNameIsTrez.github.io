// editable
const distanceMult = 5e10; // distance multiplier between planets and attractors
const constraint = 3;
const particleCount = 1000;
const attractorCount = 1;
const alpha = 255;
const magMult = 3; // particle starting magnitude multiplier

const particleRadius = 5;
const attractorRadius = 80;

const particleMass = 10;
const attractorMass = 400;

const direcVecMult = 5; // changes how big the direction vectors are shown as

const particleEffect = "fade"; // "fade", "path" or "none"

const colors = true;
const showAttractors = true;
const directionVectors = false;

const particleCollisions = false;
const attractorCollisions = false;
const reshowOnCollision = false;

const particleAttraction = false;

const randomParticlePos = false;
const randomAttractorPos = false;

const attractorColor = [200, 80, 50];
const backgroundColor = [0, 0, 0];
let backgroundColorAlpha = [...backgroundColor];
backgroundColorAlpha.push(20); // can't have .push() in the line above, as it'll just return the length of the array

// not editable
const G = 6.673e-11; // gravitational constant
let attractors = [];
let particles = [];
let currentTime, previousTime;
let previousMouseX, previousMouseY;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);

	startSimulation();
}

function draw() {
	if (particleEffect === "fade") {
		background(backgroundColorAlpha);
	} else if (particleEffect === "none") {
		background(backgroundColor);
	}

	if (showAttractors) {
		for (const attractor of attractors) {
			attractor.show();
		}
	}

	for (const i in particles) {
		const particle = particles[i];
		for (const attractor of attractors) {
			const collision = particle.attracted(attractor, attractorCollisions);
			if (attractorCollisions && collision) {
				particles.splice(i, 1); // splice changes the original array
				if (reshowOnCollision) {
					background(0);
				}
			}
		}

		if (particleAttraction) {
			for (const otherParticle of particles) {
				if (particle !== otherParticle) {
					const collision = particle.attracted(otherParticle, particleCollisions);
					if (particleCollisions && collision) {
						particles.splice(i, 1); // splice changes the original array
						if (reshowOnCollision) {
							background(0);
						}
					}
				}
			}
		}

		particle.update();

		if (particle.pos.x >= 0 && particle.pos.x < width && particle.pos.y >= 0 && particle.pos.y < height) { // prevents drawing particles that are offscreen
			if (particle === particles[i]) { // if the particle hasn't been removed yet
				particle.show();
			}
		}
		particle.prevPos.x = particle.pos.x;
		particle.prevPos.y = particle.pos.y;

		particle.acc.mult(0); // because we keep adding forces, we want to start from no acceleration
	}

	checkMouseOverGui();
}

function startSimulation() {
	attractors = [];
	particles = [];
	createAttractors();
	createParticles();
	background(0);
}

function createAttractors() {
	if (randomAttractorPos) {
		for (let i = 0; i < attractorCount; i++) {
			attractors.push(new Attractor(random(width), random(height), 15, attractorMass));
		}
	} else {
		attractors.push(new Attractor(width / 2, height / 2, attractorRadius, attractorMass));
	}
}

function createParticles() {
	if (randomParticlePos) {
		for (let i = 0; i < particleCount; i++) {
			particles.push(new Particle(random(width), random(height), 3, particleMass));
		}
	} else {
		for (let i = 0; i < particleCount; i++) {
			particles.push(new Particle(width / 4, height / 4, particleRadius, particleMass));
		}
	}
}
