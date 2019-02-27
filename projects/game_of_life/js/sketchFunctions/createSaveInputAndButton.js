function createSaveInput() {
  // create the input field for the `Save game` button
  inputSave = createInput();
  inputSave.elt.placeholder = `Save name`
  inputSave.position(gameWidth / 2 - inputSave.width / 2 - 83 / 2, gameHeight + 15 + 25);
}

function createSaveButton() {
  // create the `Save game` button
  buttonSave = createButton(`Save game`);
  buttonSave.position(inputSave.x + inputSave.width + 5, inputSave.y);
  buttonSave.mousePressed(saveGame);
}