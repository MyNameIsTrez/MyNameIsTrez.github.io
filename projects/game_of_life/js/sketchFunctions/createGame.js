function createGame() {
  playing = false;
  cells = []; // removes all cells, for when you
  // document.body.clientHeight

  gameWidth = cellWidthHeight * cellWidthCount;
  gameHeight = cellWidthHeight * cellHeightCount;
  canvasHeight = gameHeight + guiHeight;
  _textSize = gameWidth / 50;
  rectTextSpace = _textSize / 1.75;

  createCanvas(gameWidth + 1, canvasHeight + 1); // `+ 1` is needed to show the bottom and right strokes

  for (let y = 0; y < cellHeightCount; y++) {
    cells.push([]);
    for (let x = 0; x < cellWidthCount; x++) {
      cell = new Cell(x, y);
      cells[y].push(cell);
    }
  }

  cursor.x = 0;
  cursor.y = 0;

  // inputSave.position(gameWidth / 2 - inputSave.width / 2 - 83 / 2, canvasHeight + 15 + 25);
  // buttonSave.position(inputSave.x + inputSave.width + 5, inputSave.y);
}