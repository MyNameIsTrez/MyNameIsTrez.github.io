function getLoadGame(loadGameStroke, loadGameTextSize, loadGameSaveNumber, heightModifier) {
  let save = Object.keys(saves)[loadGameSaveNumber];

  push();
  stroke(loadGameStroke);
  textSize(loadGameTextSize);

  let x = gameWidth / 2 - (textWidth(loadGameSaveNumber + save) + 4 * rectTextSpace) / 2;
  let y = canvasHeight / 2 + heightModifier * textSize();

  drawLoadGame(x, y, loadGameSaveNumber, save);
  pop();
}