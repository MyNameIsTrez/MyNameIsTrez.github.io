// editable
const distanceMult = 5e10; // distance multiplier between planets and attractors
const constraint = 3;
const particleCount = 1000;
const attractorCount = 1;
const alpha = 255;
const magMult = 3; // particle starting magnitude multiplier

const particleRadius = 5;
const attractorRadius = 15;

const particleMass = 10;
const attractorMass = 400;

const direcVecMult = 5; // changes how big the direction vectors are drawn as

const guiHeight = 0; // when you want to add buttons at the top of the screen

const particleEffect = "fade"; // "fade", "path" or "none"

const colors = true;
const showAttractors = true;
const directionVectors = false;

const particleCollisions = false;
const attractorCollisions = false;
const redrawOnCollision = false;

const particleAttraction = false;

const randomParticlePos = false;
const randomAttractorPos = false;

const attractorColor = [200, 100, 100];
const backgroundColor = [0, 0, 0];

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
    background(0, 20);
  } else if (particleEffect === "none") {
    background(0);
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
        if (redrawOnCollision) {
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
            if (redrawOnCollision) {
              background(0);
            }
          }
        }
      }
    }

    particle.update();

    if (particle.pos.x >= 0 && particle.pos.x < width && particle.pos.y >= guiHeight && particle.pos.y < height) {
      if (particle === particles[i]) { // if the particle hasn't been removed yet
        particle.show();
      }
    }
    particle.prevPos.x = particle.pos.x;
    particle.prevPos.y = particle.pos.y;

    particle.acc.mult(0); // because we keep adding forces, we want to start from no acceleration
  }
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
      drawDirectionVectors(this);
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

function drawDirectionVectors(particle) {
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

class Attractor {
  constructor(x, y, r, m) {
    this.pos = createVector(x, y);
    this.radius = r;
    this.mass = m;
  }

  show(color = attractorColor) {
    // circle
    noStroke();
    fill(color);
    if (color === backgroundColor) {
      circle(this.pos.x, this.pos.y, this.radius + 2);
    } else {
      circle(this.pos.x, this.pos.y, this.radius);
    }
  }
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    // when doubleclicking
    currentTime = floor(millis()); // millis() returns 12 decimals
    const elapsedTime = currentTime - previousTime;
    previousTime = currentTime;
    const samePos = previousMouseX === mouseX && previousMouseY === mouseY;
    if (elapsedTime < 250 && samePos) {
      startSimulation();
    } else {
      if (attractors.length) {
        for (const i in attractors) {
          const attractor = attractors[i];
          xDiff = mouseX - attractor.pos.x;
          yDiff = mouseY - attractor.pos.y;
          const dist = sqrt(xDiff * xDiff + yDiff * yDiff);
          if (dist <= attractorRadius) {
            // remove attractor
            if (particleEffect === "path") {
              attractor.show(backgroundColor);
            }
            return attractors.splice(i, 1);
          }
        }
        // add attractor, can only be reached if no attractor was removed
        attractors.push(new Attractor(mouseX, mouseY, attractorRadius, attractorMass));
      } else {
        attractors.push(new Attractor(mouseX, mouseY, attractorRadius, attractorMass));
        return;
      }
    }
    previousMouseX = mouseX;
    previousMouseY = mouseY;
  }
}