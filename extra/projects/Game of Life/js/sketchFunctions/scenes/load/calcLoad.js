function calcLoad() {
  push();
  let heightModifier = 1;
  textSize(_textSize * 2);
  stroke(colors.black);

  let x = gameWidth / 2 - (textWidth("Load Save")) / 2;
  let y = heightModifier * textSize();

  fill(colors.solarizedGray);
  rect(x, y, textWidth("Load Save") + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);

  fill(colors.black);
  text("Load Save", x + rectTextSpace, y + textSize());
  pop();

  if (saveNumber > 1) { // shows the 2nd previous save
    previousSaveNumber = saveNumber - 2; // a
  } else if (saveNumber > 0) {
    previousSaveNumber = Object.keys(saves).length - 1; // b
  } else {
    previousSaveNumber = Object.keys(saves).length - 2; // c
  }
  getLoad(previousNextColor, _textSize, previousSaveNumber, -9, false);

  if (saveNumber > 0) { // shows the previous save
    previousSaveNumber = saveNumber - 1;
  } else {
    previousSaveNumber = Object.keys(saves).length - 1;
  }
  getLoad(previousNextColor, _textSize * 2, previousSaveNumber, -2.5, false);

  getLoad(0, _textSize * 3, saveNumber, 0, true); // shows the currently selected save

  if (saveNumber < Object.keys(saves).length - 1) { // shows the next save
    nextSaveNumber = saveNumber + 1;
  } else {
    nextSaveNumber = 0;
  }
  getLoad(previousNextColor, _textSize * 2, nextSaveNumber, 3, false);

  if (saveNumber < Object.keys(saves).length - 2) { // shows the 2nd next save
    nextSaveNumber = saveNumber + 2;
  } else if (saveNumber < Object.keys(saves).length - 1) {
    nextSaveNumber = 0;
  } else {
    nextSaveNumber = 1;
  }
  getLoad(previousNextColor, _textSize, nextSaveNumber, 11, false);
}