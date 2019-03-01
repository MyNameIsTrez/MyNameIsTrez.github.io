function drawLoad(x, y, save, fillColor) {
  // creates a box and draws the save name on top of it
  push();
  if (fillColor) {
    fill(fillColorButton);
  } else {
    fill(255);
  }

  rect(x, y, textWidth(save) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  fill(0);
  text(save, x + rectTextSpace, y + textSize());
  pop();
}