function drawLines() {
  for (let i = 0; i < corners.length; i++) {
    // If the corner is an even number, draw the connected lines.
    if (i % 2 === 1) {
      const corner1 = corners[i - 1],
        corner2 = corners[i];
      push();
      // If it's not a checkpoint, draw a white line, otherwise draw it green.
      if (!corner1.checkpoint)
        stroke(255);
      else
        stroke(0, 255, 0);
      line(corner1.x, corner1.y, corner2.x, corner2.y);
      pop();
    }

    // Draw a line between the new corner and the mouse.
    if (!corners[i].placed && mouseInCanvas()) {
      // If it's not a checkpoint, draw a lightly white line, otherwise draw it light-green.
      push();
      if (!corners[i].checkpoint)
        stroke(255, 127);
      else
        stroke(0, 255, 0, 127);
      line(corners[i].x, corners[i].y, mouseX, mouseY);
      pop();
    }
  }
}

function drawCornerRadii() {
  for (const corner of corners)
    if (cornerMouseDist(corner) <= cornerRadius && corner.placed)
      corner.drawRadius();
}

function cornerMouseDist(corner) {
  return dist(corner.x, corner.y, mouseX, mouseY);
}

function cornerCornerDist(corner1, corner2) {
  return dist(corner1.x, corner1.y, corner2.x, corner2.y);
}

function createCorner() {
  let existingCorner;
  for (const corner of corners) {
    if (cornerMouseDist(corner) <= cornerRadius)
      existingCorner = corner;
  }
  if (!existingCorner)
    corners.push(new Corner(mouseX, mouseY));
  else {
    corners.push(new Corner(existingCorner.x, existingCorner.y));
  }
}

function intersects(a, b, c, d, p, q, r, s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}

function mouseInCanvas() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)
    return true;
}

function mousePressed() {
  if (state === 'editor' && mouseInCanvas()) {
    createCorner();

    if (mouseButton === RIGHT) {
      // If the origin corner of the line that's being dragged isn't placed.
      if (corners[corners.length - 2] && !corners[corners.length - 2].placed)
        corners[corners.length - 2].checkpoint = true;
      corners[corners.length - 1].checkpoint = true;
    } else if (mouseButton === LEFT)
      // If the origin corner of the line that's being dragged isn't placed.
      if (corners[corners.length - 2] && !corners[corners.length - 2].placed)
        corners[corners.length - 2].checkpoint = false;

    // The radius of a corner can only be drawn if it's connected to another corner by a line.
    if (corners[corners.length - 2])
      corners[corners.length - 2].placed = true;
    corners[corners.length - 1].placed = (corners.length - 1) % 2 === 1;

    if (corners[corners.length - 1].placed)
      if (cornerCornerDist(corners[corners.length - 1], corners[corners.length - 2]) === 0)
        corners.splice(corners.length - 2, 2);
  }
}

function changeFOV() {
  const fov = sliderFOV.value();
  car.updateFOV(fov);
}

function changeRenderRayCasting() {
  renderRayCasting = !renderRayCasting;
  console.log(renderRayCasting);
}

function keyPressed() {
  switch (keyCode) { // ctrl+z
    case 90:
      if (state === 'editor')
        corners.splice(corners.length - 2, 2);
      break;
  }

  switch (state) {
    case 'race':
      switch (key) {
        case 'w':
          carKeys[0] = true;
          break;
        case 'a':
          carKeys[1] = true;
          break;
        case 'd':
          carKeys[2] = true;
          break;
      }
      break;
    case 'editor':
      switch (key) {
        case 's':
          saveJSON(corners);
          break;
      }
      break;
  }
}

function keyReleased() {
  if (key == 'w') carKeys[0] = false;
  if (key == 'a') carKeys[1] = false;
  if (key == 'd') carKeys[2] = false;  
}

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});