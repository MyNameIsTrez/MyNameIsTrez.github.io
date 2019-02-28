function getLoadGame(loadGameStroke, loadGameTextSize, loadGameSaveNumber, heightModifier, fillColor) {
  let save = Object.keys(saves)[loadGameSaveNumber];

  push();
  stroke(loadGameStroke);
  textSize(loadGameTextSize);

  let x = gameWidth / 2 - (textWidth(loadGameSaveNumber + save)) / 2;
  let y = gameHeight / 2 + heightModifier * textSize();

  drawLoadGame(x, y, save, fillColor);
  pop();
}