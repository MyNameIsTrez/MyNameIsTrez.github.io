function up() {
  if (lmbWindow === "game") {
    if (player.gameY >= cellWH) {
      player.gameY -= cellWH;
    }
  } else if (lmbWindow === "GUI") {
    for (let key in buildings) {
      // if the lmbBuilding is not at the top of the colomn
      if ((buildings[lmbBuilding][0] + 1) / maxPreviewRow > 1) {
        if (buildings[key][0] === buildings[lmbBuilding][0] - maxPreviewRow) {
          lmbBuilding = key;
          break;
        }
      }
    }

  }

}


function left() {
  if (lmbWindow === "game") {
    if (player.gameX >= cellWH + GUIWidth) {
      player.gameX -= cellWH;
    }
  } else if (lmbWindow === "GUI") {
    for (key in buildings) {
      // if the lmbBuilding is not at the beginning of the row
      if ((buildings[lmbBuilding][0]) / maxPreviewRow % 1) {
        if (buildings[key][0] === buildings[lmbBuilding][0] - 1) {
          lmbBuilding = key;
          break;
        }
      }
    }
  }
}


function down() {
  if (lmbWindow === "game") {
    if (player.gameY < height - cellWH - 1) {
      player.gameY += cellWH;
    }
  } else if (lmbWindow === "GUI") {
    for (key in buildings) {
      // if the lmbBuilding is not at the bottom of the colomn
      if ((buildings[lmbBuilding][0] + 1) / maxPreviewRow <= maxPreviewColumn - 1) {
        if (buildings[key][0] === buildings[lmbBuilding][0] + maxPreviewRow) {
          lmbBuilding = key;
          break;
        }
      }
    }
  }
}


function right() {
  if (lmbWindow === "game") {
    if (player.gameX < width - cellWH - 1) {
      player.gameX += cellWH;
    }
  } else if (lmbWindow === "GUI") {
    for (key in buildings) {
      // if the lmbBuilding is not at the end of the row
      if ((buildings[lmbBuilding][0] + 1) / maxPreviewRow % 1) {
        if (buildings[key][0] === buildings[lmbBuilding][0] + 1) {
          lmbBuilding = key;
          break;
        }
      }
    }
  }
}


function keyPressed() {
  switch (keyCode) {
    case 87: // up
      up()
      break;
    case 65: // left
      left()
      break;
    case 83: // down
      down()
      break;
    case 68: // right
      right()
      break;
    case UP_ARROW: // up
      up()
      break;
    case LEFT_ARROW: // left
      left()
      break;
    case DOWN_ARROW: // down
      down()
      break;
    case RIGHT_ARROW: // right
      right()
      break;

    case 66: // b, buys cells on the right and bottom
      buyLand();
      break;
    case 81: // q, toggles the lmbWindow
      if (lmbWindow === "game") {
        lmbWindow = "GUI";
      } else {
        lmbWindow = "game";
      }
      break;
    case 69: // e, check if lmbWindow is either "GUI" or "game"
      if (lmbWindow === "game") { // place/remove building
        cells
          [player.gameY / cellWH][(Math.floor(player.gameX - GUIWidth)) / cellWH + 1]
          .newBuilding(lmbBuilding); // place selected building
      }
      break;
    case 27: // escape
      curWindow = "game";
      break;
  }

  if (lmbWindow === "game") {
    // sets a cell to a building that corresponds to the key the user pressed
    for (let i in buildings) {
      if (keyCode === buildings[i][1]) {
        // the keycode for the number 3 is 51, so 51 - 49 = 2, building three.
        lmbBuilding = i;
      }
    }
  }
}