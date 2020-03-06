const screenPixelCountSqrt = Math.sqrt(innerWidth * innerHeight);

// Edit!
const pointCountMult = 0.09;
const maxConnectionDistMult = 35;
const distMult = 0.5;
const connectionWeightAlphaMult = 0.035;
const colorChangeMult = 500;
const debugInfo = false;
const maxFPS = 30; // 30 is stable.
const pointMinVel = 15 / maxFPS;
const pointMaxVel = 30 / maxFPS;

// Don't edit!
const pointCount = Math.floor(pointCountMult * screenPixelCountSqrt);
const maxConnectionDist = Math.floor(maxConnectionDistMult * Math.pow(screenPixelCountSqrt, 0.25));
const points = [];
let moodCol;


function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(maxFPS);
  generatePoints();
}


function draw() {
  background(36, 41, 46);

  for (const point of points) {
    point.move();
  }

  for (const point of points) {
    point.connections = [];
  }

  for (const point of points) {
    point.generateConnections();
  }

  generateMoodColor();

  for (const point of points) {
    point.showConnections(moodCol);
  }

  if (debugInfo) {
    showConnectionCounts();
    showFPS();
  }
}


function generatePoints() {
  for (let i = 0; i < pointCount; i++) {
    const x = random(width);
    const y = random(height);
    points.push(new Point(i, x, y));
  }
}

function generateMoodColor() {
  const n = frameCount / colorChangeMult + TWO_PI / 3;

  const r = n * 1;
  const g = n * 2;
  const b = n * 3;

  moodCol = [r, g, b];
  for (let i = 0; i < 3; i++) {
    moodCol[i] = (sin(moodCol[i]) + 1) / 2 * 255;
  }
}

function showConnectionCounts() {
  push();
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(20);
  for (const point of points) {
    const c = point.connections.length;
    text(c, point.pos.x, point.pos.y);
  }
  pop();
}

function showFPS() {
  const f = round(frameRate());
  push();
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(50);
  text(f, 100, 100);
  pop();
}

function pythagoras(ax, ay, bx, by) {
  return sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

class Point {
  constructor(index, x, y) {
    this.index = index;
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(pointMinVel, pointMaxVel));
    this.connections = [];
  }

  move() {
    this.pos.add(this.vel);

    // Keeps points inside of the canvas bounds.
    if (this.pos.x < -maxConnectionDist) {
      this.pos.x = width + maxConnectionDist;
    } else if (this.pos.x > width + maxConnectionDist) {
      this.pos.x = -maxConnectionDist;
    }
    if (this.pos.y < -maxConnectionDist) {
      this.pos.y = height + maxConnectionDist;
    } else if (this.pos.y > height + maxConnectionDist) {
      this.pos.y = -maxConnectionDist;
    }
  }

  generateConnections() {
    for (let otherIndex = 0; otherIndex < pointCount; otherIndex++) {
      const other = points[otherIndex];

      // Don't connect to itself.
      if (other === this) {
        continue;
      }

      const dist = pythagoras(this.pos.x, this.pos.y, other.pos.x, other.pos.y);

      // Don't connect if the line isn't visible.
      if (dist >= maxConnectionDist) {
        continue;
      }

      // Prevents 2 lines being drawn, one from each point of the line.
      // O(n) time complexity, instead of O(1). Still better in performance tests than checking if the x is higher than the other's x in my (bad) implementation, though.
      if (!other.connections.includes(this.index)) {
        this.connections.push(otherIndex);
      }
    }
  }

  showConnections(moodCol) {
    for (const otherIndex of this.connections) {
      const other = points[otherIndex];

      const dist = pythagoras(this.pos.x, this.pos.y, other.pos.x, other.pos.y);

      // Don't connect if the line wouldn't be visible.
      if (dist >= maxConnectionDist) {
        continue;
      }

      const alpha = maxConnectionDist - dist;

      // Copy the moodCol array so the alpha can be pushed.
      const moodColCopy = [...moodCol];
      moodColCopy.push(alpha);

      push();
      stroke(moodColCopy);

      strokeWeight(alpha * connectionWeightAlphaMult);

      const x1 = this.pos.x;
      const y1 = this.pos.y;
      const x2 = other.pos.x;
      const y2 = other.pos.y;
      line(x1, y1, x2, y2);
      pop();
    }
  }
}