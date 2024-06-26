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
  strokeWeight(gridStrokeWeight);
  if (!playing) { // draws the grid
    if (drawGridPaused) {
      for (let i = 1; i < cellWidthCount; i++) { // vertical lines
        line(i * cellWidthHeight, 0, i * cellWidthHeight, gameHeight);
      }

      for (let i = 1; i < cellHeightCount; i++) { // horizontal lines
        line(0, i * cellWidthHeight, gameWidth, i * cellWidthHeight);
      }
    }
  } else {
    if (drawGridPlaying) {
      for (let i = 1; i < cellWidthCount; i++) { // vertical lines
        line(i * cellWidthHeight, 0, i * cellWidthHeight, gameHeight);
      }

      for (let i = 1; i < cellHeightCount; i++) { // horizontal lines
        line(0, i * cellWidthHeight, gameWidth, i * cellWidthHeight);
      }
    }
  }
  pop();

  if (mouseIsPressed) {
    if (!playing) {
      if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
        const cell = cells[floor(mouseY / cellWidthHeight)][floor(mouseX / cellWidthHeight)];
        cell.alive = firstCellAlive ? 0 : 1;
        cell.ticksLeftColored = 0;
      }
    }
  }

  // create the boundary box for the grid
  push();
  noFill();
  stroke(strokeColor);
  rect(0, 0, gameWidth, gameHeight);
  pop();

  if (showDebugInfo && playing) {
    let i = 1;
    text(`FPS: ${floor(frameRate())}`, 10, i++ * 20);

    let aliveCount = 0,
      coloredCount = 0;
    for (let row of cells) {
      for (let cell of row) {
        if (cell.alive) {
          aliveCount++;
        } else if (playing && cell.ticksLeftColored > 0 && cell.ticksLeftColored !== Infinity) {
          coloredCount++;
        }
      }
    }
    text(`Alive Cells: ${aliveCount}`, 10, i++ * 20);
    text(`Colored Cells: ${coloredCount}`, 10, i++ * 20);
  }
}