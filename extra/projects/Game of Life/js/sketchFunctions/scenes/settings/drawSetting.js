function drawSetting(x, y, setting, info, fillColor) {
  // creates a box and draws the setting name and info on top of it
  push();
  if (fillColor) {
    fill(colors.orange);
  } else {
    fill(colors.white);
  }

  rect(x, y, textWidth(setting + info) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  fill(colors.black);
  text(setting + info, x + rectTextSpace, y + textSize());
  pop();
}