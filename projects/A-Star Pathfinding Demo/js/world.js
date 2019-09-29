function initWorld() {
  world = [];
  if (randomMap) {
    createRandomWorld();
  } else {
    loadWorld();
  }
  addWorldNeighbors();
}

function createRandomWorld() {
  for (let col = 0; col < cols; col++) {
    world[col] = [];
    for (let row = 0; row < rows; row++) {
      const wall = random(1) < (wallPercentage / 100);
      world[col][row] = new Tile(col, row, wall);
    }
  }
}

function loadWorld() {
  const map = JSON.parse(LZString.decompressFromUTF16(maps[loadedMapIndex]));
  rows = map.rows;
  cols = map.cols;
  tileSizeFull = map.tileSizeFull;
  playerSpawn = map.playerSpawn;
  enemySpawns = map.enemySpawns;

  for (let col = 0; col < cols; col++) {
    world[col] = [];
    for (let row = 0; row < rows; row++) {
      world[col][row] = new Tile(col, row, map.walls[col][row]);
    }
  }
}

function addWorldNeighbors() {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      world[col][row].addNeighbors();
    }
  }
}