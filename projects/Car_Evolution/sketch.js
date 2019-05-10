let corners = [];
const cornerRadius = 50;

function setup() {
  createCanvas(innerWidth - 4, innerHeight - 4);
}

function draw() {
  background(0);
  stroke(255);

  drawLines();
  drawCornerRadii();
}

function drawLines() {
  for (let i = 0; i < corners.length; i++) {
    if (i % 2 === 1) { // If it's the second corner.
      const corner1 = corners[i - 1], corner2 = corners[i];
      line(corner1.x, corner1.y, corner2.x, corner2.y);
    }
  }
}

function drawCornerRadii() {
  for (const corner of corners) {
    if (cornerMouseDist(corner) <= cornerRadius && corner.placed) {
      corner.drawRadius();
    }
  }
}

function cornerMouseDist(corner) {
  return dist(corner.x, corner.y, mouseX, mouseY);
}

function mousePressed() {
  createCorner();

  // The radius of a corner can only be drawn if it's connected to another corner by a line.
  if (corners[corners.length - 2]) {
    corners[corners.length - 2].placed = true;
  }
  corners[corners.length - 1].placed = (corners.length - 1) % 2 === 1;
}

function createCorner() {
  let existingCorner;
  for (const corner of corners) {
    if (cornerMouseDist(corner) <= cornerRadius) {
      existingCorner = corner;
    }
  }
  if (!existingCorner) {
    corners.push(new Corner(mouseX, mouseY));
  } else {
    corners.push(new Corner(existingCorner.x, existingCorner.y));
  }
}