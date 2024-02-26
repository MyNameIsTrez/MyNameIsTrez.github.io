function createGame() {
  playing = false;
  cells = []; // removes all cells

  // pick the smallest temp (which is the cellWidthheight)
  // this is to make sure the cells always fit in the window
  let temp2 = (windowWidth - emptySpace * 2) / cellWidthCount;
  let temp1 = (windowHeight - emptySpace * 2) / cellHeightCount;
  if (temp1 < temp2) {
    cellWidthHeight = temp1;
  } else {
    cellWidthHeight = temp2;
  }

  gameWidth = cellWidthHeight * cellWidthCount;
  gameHeight = cellWidthHeight * cellHeightCount;

  _textSize = gameWidth / 50;
  rectTextSpace = _textSize / 1.75;

  createCanvas(gameWidth + 1, gameHeight + 1); // "+ 1" is needed to show the bottom and right strokes

  for (let y = 0; y < cellHeightCount; y++) {
    cells.push([]);
    for (let x = 0; x < cellWidthCount; x++) {
      cell = new Cell(x, y);
      cells[y].push(cell);
    }
  }

  cursor.x = 0;
  cursor.y = 0;

  // inputSave.position(gameWidth / 2 - inputSave.width / 2 - 83 / 2, gameHeight + 15 + 25);
  // buttonSave.position(inputSave.x + inputSave.width + 5, inputSave.y);
}