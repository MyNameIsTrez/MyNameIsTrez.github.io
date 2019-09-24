function createWorldArray() {
  world = [];
  if (randomMap) {
    for (let col = 0; col < cols; col++) {
      world[col] = [];
      for (let row = 0; row < rows; row++) {
        const wall = random(1) < (wallPercentage / 100);
        world[col][row] = new Tile(col, row, wall);
      }
    }
  } else {
    for (let col = 0; col < cols; col++) {
      world[col] = [];
      for (let row = 0; row < rows; row++) {
        world[col][row] = new Tile(col, row, booleanWorld[col][row]);
      }
    }
  }

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      world[col][row].addNeighbors();
    }
  }
}