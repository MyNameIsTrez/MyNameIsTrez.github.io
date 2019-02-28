function calcSaveGame() {
  let saveGamePlaceholderText = `WIP SAVE SCREEN`;
  push();
  textSize(_textSize);
  let x = gameWidth / 2 - (textWidth(saveGamePlaceholderText) + 2 * rectTextSpace) / 2;
  let y = gameHeight / 2 - textSize();
  rect(x, y, textWidth(saveGamePlaceholderText) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  text(saveGamePlaceholderText, x + rectTextSpace, y + textSize());
  pop();
}