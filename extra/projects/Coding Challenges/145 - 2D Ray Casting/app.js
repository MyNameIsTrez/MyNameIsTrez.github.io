const walls = [];
let particle;
let ray;
let xoff = 0;
let yoff = 1000000; // The particle moves diagonally if this is 0 for some reason.

let mouseControl = false;
let raySlider, wallCountSlider, reflectionCountSlider;
// let alphaSlider;
let sourceIllumination = false;
let edgeWalls = true;

function setup() {
  createButton('mouse control').mousePressed(mouseControlToggle);
  raySlider = createSlider(0, 12, 0).input(createParticle);
  wallCountSlider = createSlider(1, 20, 5).input(() => createWalls(wallCountSlider.value()));
  // alphaSlider = createSlider(1, 255, 63);
  reflectionCountSlider = createSlider(0, 5, 1);
  createButton('source illumination').mousePressed(sourceIlluminationToggle);
  createButton('edge walls').mousePressed(() => {
    setEdgeWalls(edgeWalls = !edgeWalls)
  });

  createCanvas(innerWidth - 25, innerHeight - 80);
  // Needed to show walls on the left and bottom edge.
  width = width - 1;
  height = height - 1;

  setEdgeWalls(edgeWalls);
  createWalls(wallCountSlider.value());
  // console.log("walls: " + walls.length);

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
  particle.drawRays(walls);
}

function mouseControlToggle() {
  mouseControl = !mouseControl;
}

function setEdgeWalls(show) {
  // Draw the walls at the edges of the canvas so the rays are always visible.
  if (show) {
    walls.splice(
      0, 0,
      new Boundary(0, 0, width, 0),
      new Boundary(width, 0, width, height),
      new Boundary(width, height, 0, height),
      new Boundary(0, height, 0, 0)
    );
  } else {
    walls.splice(0, 4);
  }
}

function createWalls(wallCount) {
  walls.length = edgeWalls ? 4 : 0;
  // Add 5 randomly placed walls.
  for (let i = 0; i < wallCount; i++) {
    const x1 = random(width);
    const y1 = random(height);
    const x2 = random(width);
    const y2 = random(height);
    walls.push(new Boundary(x1, y1, x2, y2));
  }
}

function createParticle() {
  particle = new Particle(raySlider.value());
}

function sourceIlluminationToggle() {
  sourceIllumination = !sourceIllumination;
}