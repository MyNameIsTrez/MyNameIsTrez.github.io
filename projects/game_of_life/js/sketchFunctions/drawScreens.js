function drawLoadGame(x, y, save, fillColor) {
  // creates a box and draws the save name on top of it
  push();
  if (fillColor) {
    fill(fillColorButton);
  } else {
    noFill();
  }
  rect(x, y, textWidth(save) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  fill(0);
  text(save, x + rectTextSpace, y + textSize());
  pop();
}

function drawSetting(x, y, setting, info, fillColor) {
  // creates a box and draws the setting name and info on top of it
  push();
  if (fillColor) {
    fill(fillColorButton);
  } else {
    noFill();
  }
  rect(x, y, textWidth(setting + info) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  fill(0);
  text(setting + info, x + rectTextSpace, y + textSize());
  pop();
}