function calcLoadGame() {
  if (saveNumber > 1) { // shows the 2nd previous save
    previousSaveNumber = saveNumber - 2; // a
  } else if (saveNumber > 0) {
    previousSaveNumber = Object.keys(saves).length - 1; // b
  } else {
    previousSaveNumber = Object.keys(saves).length - 2; // c
  }
  getLoadGame(previousNextColor, _textSize, previousSaveNumber, -16, false);

  if (saveNumber > 0) { // shows the previous save
    previousSaveNumber = saveNumber - 1;
  } else {
    previousSaveNumber = Object.keys(saves).length - 1;
  }
  getLoadGame(previousNextColor, _textSize * 2, previousSaveNumber, -5, false);

  getLoadGame(0, _textSize * 3, saveNumber, -1, true); // shows the currently selected save

  if (saveNumber < Object.keys(saves).length - 1) { // shows the next save
    nextSaveNumber = saveNumber + 1;
  } else {
    nextSaveNumber = 0;
  }
  getLoadGame(previousNextColor, _textSize * 2, nextSaveNumber, 2.5, false);

  if (saveNumber < Object.keys(saves).length - 2) { // shows the 2nd next save
    nextSaveNumber = saveNumber + 2;
  } else if (saveNumber < Object.keys(saves).length - 1) {
    nextSaveNumber = 0;
  } else {
    nextSaveNumber = 1;
  }
  getLoadGame(previousNextColor, _textSize, nextSaveNumber, 11, false);
}