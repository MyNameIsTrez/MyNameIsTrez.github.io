function createWorldArray() {
  world = [];
  for (let i = 0; i < cols; i++) {
    world[i] = [];
    for (let j = 0; j < rows; j++) {
      world[i][j] = new Tile(i, j);
    }
  }
}

function drawWorldLines() {
  push();
  stroke(150);
  for (let i = 0; i < cols + 1; i++) {
    line(i * size, 0, i * size, height);
    for (let j = 0; j < rows + 1; j++) {
      line(0, j * size, width, j * size);
    }
  }
  pop();
}