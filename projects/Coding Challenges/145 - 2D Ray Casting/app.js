const walls = [];
let particle;
let ray;
let xoff = 0;
let yoff = 1000000; // The particle moves diagonally if this is 0 for some reason.

function setup() {
  createCanvas(outerWidth, outerHeight);

  // Add 5 randomly placed walls.
  for (let i = 0; i < 5; i++) {
    const x1 = random(width);
    const y1 = random(height);
    const x2 = random(width);
    const y2 = random(height);
    walls.push(new Boundary(x1, y1, x2, y2));
  }

  // Draw the walls at the edges of the canvas so the rays are always visible.
  // walls.push(new Boundary(0, 0, width, 0));
  // walls.push(new Boundary(width, 0, width, height));
  // walls.push(new Boundary(width, height, 0, height));
  // walls.push(new Boundary(0, height, 0, 0));

  particle = new Particle();
}

function draw() {
  background(0);
  for (const wall of walls) {
    wall.show();
  }

  // Use the cursor to move the particle.
  particle.update(mouseX, mouseY);

  // Use Perlin noise to move the particle.
  // particle.update(noise(xoff) * width, noise(yoff) * height);
  // xoff += 0.01;
  // yoff += 0.01;

  particle.show();
  particle.look(walls);
}