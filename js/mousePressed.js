function mousePressed() {
  for (let i = 0; i < previews.game.length; i++) {
    preview = previews.game[i];
    preview.clicked();
  }

  for (let i = 0; i < cells.length; i++) {
    for (let j = 1; j < cells[i].length; j++) {
      cell = cells[i][j];
      cell.clicked();
    }
  }

  for (let i = 0; i < buttons.game.length; i++) {
    button = buttons.game[i];
    button.clicked();
  }

  for (let i = 0; i < buttons.upgrades.length; i++) {
    button = buttons.upgrades[i];
    button.clicked();
  }
}