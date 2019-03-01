function load(saveNumber) {
  let saveName = Object.keys(saves)[saveNumber];

  cellTickRate = saves[saveName][0];
  cellWidthCount = saves[saveName][1];
  cellHeightCount = saves[saveName][2];

  createGame();

  let alive = saves[saveName][3]; // the starting cell"s alive state
  let cellX = 0;
  let cellY = 0;

  for (const size of saves[saveName][4]) {
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

  screen = "game";
}