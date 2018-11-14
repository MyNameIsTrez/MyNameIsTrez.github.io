function mousePressed() { // left-clicking removes the building in the cell
  for (let i = 0; i < cells.length; i++) {
    for (let j = 1; j < cells[i].length; j++) {
      cell = cells[i][j];
      cell.clicked();
    }
  }

  for (let i = 0; i < previews.length; i++) {
    preview = previews[i];
    preview.clicked();
  }

  for (let i = 0; i < buttons.length; i++) {
    button = buttons[i];
    button.clicked();
  }
}