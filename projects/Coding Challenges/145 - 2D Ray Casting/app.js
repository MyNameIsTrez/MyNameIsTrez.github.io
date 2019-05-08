const walls = [];
let particle;
let ray;
let xoff = 0;
let yoff = 1000000; // The particle moves diagonally if this is 0 for some reason.

let mouseControl = true;
let raySlider;
let sourceIllumination = false;
let canvasWalls = true;

function setup() {
  createButton('mouse control').mousePressed(mouseControlToggle);
  raySlider = createSlider(1, 360, 180).input(createParticle);
  createButton('source illumination').mousePressed(sourceIlluminationToggle);

  createCanvas(innerWidth - 25, innerHeight - 50);
  // Needed to show walls on the left and bottom edge.
  width = width - 1;
  height = height - 1;

  // Add 5 randomly placed walls.
  for (let i = 0; i < 5; i++) {
    const x1 = random(width);
    const y1 = random(height);
    const x2 = random(width);
    const y2 = random(height);
    walls.push(new Boundary(x1, y1, x2, y2));
  }

  // Draw the walls at the edges of the canvas so the rays are always visible.
  if (canvasWalls) {
    walls.push(new Boundary(0, 0, width, 0));
    walls.push(new Boundary(width, 0, width, height));
    walls.push(new Boundary(width, height, 0, height));
    walls.push(new Boundary(0, height, 0, 0));
  }

  createParticle();
}

function draw() {
  background(0);
  for (const wall of walls) {
    wall.show();
  }

  if (mouseControl) {
    // Use the cursor to move the particle.
    particle.update(mouseX, mouseY);
  } else {
    // Use Perlin noise to move the particle.
    particle.update(noise(xoff) * width, noise(yoff) * height);
    xoff += 0.01;
    yoff += 0.01;
  }

  particle.show();
  particle.look(walls);
}

function mouseControlToggle() {
  mouseControl = !mouseControl;
}

function createParticle() {
  particle = new Particle(raySlider.value());
}

function sourceIlluminationToggle() {
  sourceIllumination = !sourceIllumination;
}