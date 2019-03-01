function calcSave() {
  let savePlaceholderText = "WIP SAVE SCREEN";
  push();
  textSize(_textSize);
  let x = gameWidth / 2 - (textWidth(savePlaceholderText) + 2 * rectTextSpace) / 2;
  let y = gameHeight / 2 - textSize();
  rect(x, y, textWidth(savePlaceholderText) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  text(savePlaceholderText, x + rectTextSpace, y + textSize());
  pop();
}