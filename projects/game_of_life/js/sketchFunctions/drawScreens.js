function drawLoadGame(x, y, saveNumber, save) {
  // creates a box and draws the save name on top of it
  rect(x, y, textWidth(save) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  text(save, x + rectTextSpace, y + textSize());
}

function drawSetting(x, y, setting, info) {
  // creates a box and draws the setting name and info on top of it
  rect(x, y, textWidth(setting + info) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  text(setting + info, x + rectTextSpace, y + textSize());
}