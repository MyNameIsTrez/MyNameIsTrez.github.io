function getLoad(loadStroke, loadTextSize, loadSaveNumber, heightModifier, fillColor) {
  let save = Object.keys(saves)[loadSaveNumber];

  push();
  stroke(loadStroke);
  textSize(loadTextSize);

  let x = gameWidth / 2 - (textWidth(loadSaveNumber + save)) / 2;
  let y = gameHeight / 2 + heightModifier * textSize();

  drawLoad(x, y, save, fillColor);
  pop();
}