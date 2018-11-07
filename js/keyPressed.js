function up() {
  if (lmbWindow === "game") {
    if (player.gameY >= cellWH) {
      player.gameY -= cellWH;
    }
  } else if (lmbWindow === "GUI") {
    for (let key in buildings) {
      // if the selectedBuilding is not at the top of the colomn
      if ((buildings[selectedBuilding][0] + 1) / maxPreviewRow > 1) {
        // if the key's index is equal to the index of selectedBuilding - maxPreviewRow
        if (buildings[key][0] === buildings[selectedBuilding][0] - maxPreviewRow) {
          selectedBuilding = key;
          break;
        }
      }
    }
  } else if (lmbWindow === "buttons") {
    switch (selectedButton) {
      case "upgrades":
        selectedButton = "stats";
        break;
      case "buy land":
        selectedButton = "upgrades";
        break;
      case "menu":
        selectedButton = "buy land";
        break;
      case "help":
        selectedButton = "buy land";
        break;
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
      // if the selectedBuilding is not at the beginning of the row
      if ((buildings[selectedBuilding][0]) / maxPreviewRow % 1) {
        // if the key's index is equal to the index of selectedBuilding - 1
        if (buildings[key][0] === buildings[selectedBuilding][0] - 1) {
          selectedBuilding = key;
          break;
        }
      }
    }
  } else if (lmbWindow === "buttons") {
    switch (selectedButton) {
      case "help":
        selectedButton = "menu";
        break;
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
      // if the selectedBuilding is not at the bottom of the colomn
      if ((buildings[selectedBuilding][0] + 1) / maxPreviewRow <= maxPreviewColumn - 1) {
        // if the key's index is equal to the index of selectedBuilding + maxPreviewRow
        if (buildings[key][0] === buildings[selectedBuilding][0] + maxPreviewRow) {
          selectedBuilding = key;
          break;
        }
      }
    }
  } else if (lmbWindow === "buttons") {
    switch (selectedButton) {
      case "stats":
        selectedButton = "upgrades";
        break;
      case "upgrades":
        selectedButton = "buy land";
        break;
      case "buy land":
        selectedButton = "menu";
        break;
      case "buy land":
        selectedButton = "help";
        break;
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
      // if the selectedBuilding is not at the end of the row
      if ((buildings[selectedBuilding][0] + 1) / maxPreviewRow % 1) {
        // if the key's index is equal to the index of selectedBuilding + 1
        if (buildings[key][0] === buildings[selectedBuilding][0] + 1) {
          selectedBuilding = key;
          break;
        }
      }
    }
  } else if (lmbWindow === "buttons") {
    switch (selectedButton) {
      case "menu":
        selectedButton = "help";
        break;
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
    case 74: // j
      lmbWindow = "game";
      break;
    case 75: // k
      lmbWindow = "GUI";
      break;
    case 76: // l
      lmbWindow = "buttons";
      break;
    case 69: // e, check if lmbWindow is either "GUI" or "game"
      if (lmbWindow === "game") { // place/remove building
        cells
        [player.gameY / cellWH][(Math.floor(player.gameX - GUIWidth)) / cellWH + 1]
          .newBuilding(selectedBuilding); // place selected building
      } else if (lmbWindow === "buttons") {
        switch (selectedButton) {
          case "buy land":
            buyLand();
            break;
          case "menu":
            curWindow = "menu"
            break;
          case "help":
            curWindow = "help"
            break;
          case "upgrades":
            curWindow = "upgrades"
            break;
          case "stats":
            curWindow = "stats"
            break;
        }
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
        selectedBuilding = i;
      }
    }
  }
}