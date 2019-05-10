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

function createCorner() {
  let existingCorner;
  for (const corner of corners)
    if (cornerMouseDist(corner) <= cornerRadius)
      existingCorner = corner;
  if (!existingCorner)
    corners.push(new Corner(mouseX, mouseY));
  else
    corners.push(new Corner(existingCorner.x, existingCorner.y));
}

function mouseInCanvas() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)
    return true;
}

function mousePressed() {
  if (state === "editor" && mouseInCanvas()) {
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
  }
}

function keyPressed() {
  switch (keyCode) { // ctrl+z
    case 90:
      if (state === "editor")
        corners.splice(corners.length - 2, 2);
      break;
  }
}

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});