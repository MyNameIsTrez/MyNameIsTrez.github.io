let state = "editor";
let corners = [];

// Editor
const cornerRadius = 50;

function setup() {
  // Navigation
  createButton('race').mousePressed(function() {
    state = 'race';
  });
  createButton('editor').mousePressed(function() {
    state = 'editor';
  });

  // Editor
  createCanvas(innerWidth - 21, innerHeight - 69);
}

function draw() {
  switch (state) {
    case "race":
      background(100);
      break;
    case "editor":
      background(0);
      drawLines();
      drawCornerRadii();
      break;
  }
}

function drawLines() {
  for (let i = 0; i < corners.length; i++) {
    // If the corner is an even number, draw the connected lines.
    if (i % 2 === 1) {
      const corner1 = corners[i - 1],
        corner2 = corners[i];
      push();
      // If it's not a checkpoint, draw a white line, otherwise draw it green.
      if (!corner1.checkpoint) {
        stroke(255);
      } else {
        stroke(0, 255, 0);
      }
      line(corner1.x, corner1.y, corner2.x, corner2.y);
      pop();
    }

    // Draw a line between the new corner and the mouse.
    if (!corners[i].placed) {
      // If it's not a checkpoint, draw a lightly white line, otherwise draw it light-green.
      push();
      if (!corners[i].checkpoint) {
        stroke(255, 127);
      } else {
        stroke(0, 255, 0, 127);
      }
      if (mouseInCanvas()) {
        line(corners[i].x, corners[i].y, mouseX, mouseY);
      }
      pop();
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

function mouseInCanvas() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    return true;
  }
}

function mousePressed() {
  if (mouseInCanvas()) {
    createCorner();

    if (mouseButton === RIGHT) {
      // ???
      // corners[corners.length - 2].checkpoint = true;
      corners[corners.length - 1].checkpoint = true;
    }

    // The radius of a corner can only be drawn if it's connected to another corner by a line.
    if (corners[corners.length - 2]) {
      corners[corners.length - 2].placed = true;
    }
    corners[corners.length - 1].placed = (corners.length - 1) % 2 === 1;
  }
}

function keyPressed() {
  if (keyCode === 90) { // ctrl+z
    undo();
  }
}

function undo() {
  corners.splice(corners.length - 2, 2);
}

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});