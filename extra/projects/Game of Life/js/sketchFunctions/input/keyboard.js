function pausePlay() {
  if (scene === "game") {
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

    case 65: // a, open the load scene
      loadScene();
      break;

    case 83: // s, open the settings scene
      settingsScene();
      break;

    case 68: // d, open the tutorial scene
      tutorialScene();
      break;

    // case 68: // d, open the save scene
    //   saveScene();
    //   break;
  }
}