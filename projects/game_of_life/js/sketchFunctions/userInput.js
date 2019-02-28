function click() {
  switch (screen) {
    case `game`:
      if (!playing) {
        let cell = cells[floor(cursor.y / cellWidthHeight)][floor(cursor.x / cellWidthHeight)];
        if (!cell.alive) {
          cell.alive = 1;
        } else {
          cell.alive = 0;
        }
      }
      break;
    case `loadGame`:
      loadGame(saveNumber);
      screen = `game`;
      break;
    case `settings`:
      switch (settings[settingNumber]) {
        case `clear cells`:
          createGame();
          screen = `game`;
          break;
      }
      break;
  }
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW: // up
      up()
      break;
    case DOWN_ARROW: // down
      down()
      break;
    case LEFT_ARROW: // left
      left()
      break;
    case RIGHT_ARROW: // right
      right()
      break;

    case 89: //y, click
      click();
      break;

    case 87: // w, pause/play
      pausePlay();
      break;

    case 65: // a, open the load screen
      loadGameScreen();
      break;

    case 83: // s, open the settings screen
      settingsScreen();
      break;

    case 68: // d, open the tutorial screen
      tutorialScreen();
      break;

      // case 68: // d, open the save screen
      //   saveGameScreen();
      //   break;
  }
}

function mousePressed() {
  if (!playing) {
    if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
      firstCellAlive = cells[floor(mouseY / cellWidthHeight)][floor(mouseX / cellWidthHeight)].alive;
    }
  }
}

window.addEventListener(`contextmenu`, (e) => {
  e.preventDefault();
});