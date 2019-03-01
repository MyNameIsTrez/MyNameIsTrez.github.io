function pausePlay() {
  if (screen === "game") {
    if (playing) {
      playing = false;
    } else {
      playing = true;
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW: // up
      up();
      break;
    case DOWN_ARROW: // down
      down();
      break;
    case LEFT_ARROW: // left
      left();
      break;
    case RIGHT_ARROW: // right
      right();
      break;

    case 89: //y, click
      click();
      break;

    case 87: // w, pause/play
      pausePlay();
      break;

    case 65: // a, open the load screen
      loadScreen();
      break;

    case 83: // s, open the settings screen
      settingsScreen();
      break;

    case 68: // d, open the tutorial screen
      tutorialScreen();
      break;

    // case 68: // d, open the save screen
    //   saveScreen();
    //   break;
  }
}