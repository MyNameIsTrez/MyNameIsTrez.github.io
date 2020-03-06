function drawLoad(x, y, save, fillColor) {
  // creates a box and draws the save name on top of it
  push();
  if (fillColor) {
    fill(colors.orange);
  } else {
    fill(colors.white);
  }

  rect(x, y, textWidth(save) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  fill(colors.black);
  text(save, x + rectTextSpace, y + textSize());
  pop();
}