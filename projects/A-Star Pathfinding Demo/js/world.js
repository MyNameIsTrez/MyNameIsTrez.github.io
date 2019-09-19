function createWorldArray() {
  world = [];
  for (let col = 0; col < cols; col++) {
    world[col] = [];
    for (let row = 0; row < rows; row++) {
      const wall = random(1) < 0.2
      world[col][row] = new Tile(col, row, wall);
    }
  }

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      world[col][row].addNeighbors();
    }
  }
}