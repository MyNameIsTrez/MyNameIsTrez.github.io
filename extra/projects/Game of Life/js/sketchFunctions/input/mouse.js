function click() {
  switch (scene) {
    case "game":
      if (!playing) {
        let cell = cells[floor(cursor.y / cellWidthHeight)][floor(cursor.x / cellWidthHeight)];
        if (!cell.alive) {
          cell.alive = 1;
        } else {
          cell.alive = 0;
        }
      }
      break;
    case "load":
      load(saveNumber);
      scene = "game";
      break;
    case "settings":
      switch (settings[settingNumber]) {
        case "clear cells":
          createGame();
          scene = "game";
          break;
      }
      break;
  }
}

function mousePressed() {
  if (!playing) {
    if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
      firstCellAlive = cells[floor(mouseY / cellWidthHeight)][floor(mouseX / cellWidthHeight)].alive;
    }
  }
}