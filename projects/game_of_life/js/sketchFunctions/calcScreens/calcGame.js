function calcGame() {
  // limits the cells' updating speed to the cellTickRate
  if (frameCount % (_frameRate / cellTickRate) === 0) {
    for (let y in cells) {
      for (let x in cells[y]) {
        cells[y][x].getNeighbours();
      }
    }

    for (let y in cells) {
      for (let x in cells[y]) {
        cells[y][x].calculate();
      }
    }
  }

  for (let y in cells) {
    for (let x in cells[y]) {
      cells[y][x].draw();
    }
  }

  if (!playing) {
    cursor.draw();
  }

  push();
  stroke(strokeColor);
  if (!playing) {
    if (drawGridPaused) {
      for (let i = 1; i < cellWidthCount; i++) {
        line(i * cellWidthHeight, 0, i * cellWidthHeight, gameHeight);
      }

      for (let i = 1; i < cellHeightCount; i++) {
        line(0, i * cellWidthHeight, gameHeight, i * cellWidthHeight);
      }
    }
  } else {
    if (drawGridPlaying) {
      for (let i = 1; i < cellWidthCount; i++) {
        line(i * cellWidthHeight, 0, i * cellWidthHeight, gameHeight);
      }

      for (let i = 1; i < cellHeightCount; i++) {
        line(0, i * cellWidthHeight, gameHeight, i * cellWidthHeight);
      }
    }
  }
  pop();

  if (mouseIsPressed) {
    if (!playing) {
      if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
        cells[floor(mouseY / cellWidthHeight)][floor(mouseX / cellWidthHeight)].alive = firstCellAlive ? 0 : 1;
      }
    }
  }

  // create the boundary box for the grid
  push();
  noFill();
  stroke(strokeColor);
  rect(0, 0, gameWidth, gameHeight);
  pop();
}