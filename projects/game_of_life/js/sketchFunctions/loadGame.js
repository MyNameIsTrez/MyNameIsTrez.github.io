function loadGame(saveNumber) {
  let saveName = Object.keys(saves)[saveNumber];

  cellTickRate = saves[saveName][0];
  cellWidthHeight = saves[saveName][1];
  cellWidthCount = saves[saveName][2];
  cellHeightCount = saves[saveName][3];

  createGame();

  let alive = saves[saveName][4]; // the starting cell`s alive state
  let cellX = 0;
  let cellY = 0;

  for (const size of saves[saveName][5]) {
    for (let i = 0; i < size; i++) {
      if (cellX < cellWidthCount) {
        cells[cellY][cellX++].alive = alive;
      } else {
        cellX = 0;
        cellY++;
        cells[cellY][cellX++].alive = alive;
      }
    }
    alive = !alive ? 1 : 0;
  }

  screen = `game`;
}