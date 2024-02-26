function keyPressed() {
  switch (key) {
    case 'm':
      saveWorld();
      break;
  }
}

function mousePressed() {
  const pos = clickedCanvas();
  if (pos) {
    // Make a deep copy of the first tile clicked.
    firstTilePressedCopy = JSON.parse(JSON.stringify(world[pos.col][pos.row]));
  }
}

function clickedCanvas() {
  const minX = mouseX >= 0;
  const maxX = mouseX < tileSize * cols;
  const minY = mouseY >= 0;
  const maxY = mouseY < tileSize * rows;

  let col, row;
  if (minX && maxX && minY && maxY) {
    col = floor(mouseX / tileSize);
    row = floor(mouseY / tileSize);
  }

  if (col !== undefined && row !== undefined) {
    return { 'col': col, 'row': row };
  }
}

function changeTile() {
  const pos = clickedCanvas();
  if (pos) {
    const clicked = world[pos.col][pos.row];
    if (clicked.type === firstTilePressedCopy.type) {
      if (clicked.type !== selection) {
        clicked.type = selection;
      } else {
        clicked.type = 'empty';
      }
    }
    show();
  }
}