function up() {
  switch (lmbWindow) {
    case "game":
      if (cursor.gameY >= cellWH) {
        cursor.gameY -= cellWH;
      }
      break;
    case "previews":
      for (let key in buildings) {
        // if the selectedBuilding is not at the top of the colomn
        if ((buildings[selectedBuilding][0] + 1) / previewColumns > 1) {
          // if the key's index is equal to the index of selectedBuilding - previewRows
          if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding) - previewColumns) {
            selectedBuilding = key;
            break;
          }
        }
      }
      break;
    case "buttons":
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
      break;
  }
}


function left() {
  switch (lmbWindow) {
    case "game":
      if (cursor.gameX >= cellWH + GUIWidth) {
        cursor.gameX -= cellWH;
      }
      break;
    case "previews":
      for (key in buildings) {
        // if the selectedBuilding is not at the beginning of the row
        if ((buildings[selectedBuilding][0]) / previewColumns % 1) {
          // if the key's index is equal to the index of selectedBuilding - 1
          // if (buildings[key][0] === buildings[selectedBuilding][0] - 1) {
          if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding) - 1) {
            selectedBuilding = key;
            break;
          }
        }
      }
      break;
    case "buttons":
      switch (selectedButton) {
        case "help":
          selectedButton = "menu";
          break;
      }
      break;
  }
}


function down() {
  switch (lmbWindow) {
    case "game":
      if (cursor.gameY < height - cellWH - 1) {
        cursor.gameY += cellWH;
      }
      break;
    case "previews":
      for (key in buildings) {
        // if the selectedBuilding is not at the bottom of the colomn
        if ((buildings[selectedBuilding][0] + 1) / previewColumns <= previewColumns - 1) {
          // if the key's index is equal to the index of selectedBuilding + previewRows
          if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding) + previewColumns) {
            selectedBuilding = key;
            break;
          }
        }
      }
      break;
    case "buttons":
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
      break;
  }
}


function right() {
  switch (lmbWindow) {
    case "game":
      if (cursor.gameX < width - cellWH - 1) {
        cursor.gameX += cellWH;
      }
      break;
    case "previews":
      for (key in buildings) {
        // if the selectedBuilding is not at the end of the row
        if ((buildings[selectedBuilding][0] + 1) / previewColumns % 1) {
          // if the key's index is equal to the index of selectedBuilding + 1
          // if (buildings[key][0] === buildings[selectedBuilding][0] + 1) {
          if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding) + 1) {
            selectedBuilding = key;
            break;
          }
        }
      }
      break;
    case "buttons":
      switch (selectedButton) {
        case "menu":
          selectedButton = "help";
          break;
      }
      break;
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
      lmbWindow = "previews";
      break;
    case 76: // l
      lmbWindow = "buttons";
      break;
    case 69: // e, check if lmbWindow is either "previews" or "game"
      if (lmbWindow === "game") { // place/remove building
        cells
          [cursor.gameY / cellWH][(Math.floor(cursor.gameX - GUIWidth)) / cellWH + 1]
          .newBuilding(selectedBuilding); // place selected building
      } else if (lmbWindow === "previews") {
        lmbWindow = "game";
      } else if (lmbWindow === "buttons") {
        switch (selectedButton) {
          case "buy land":
            buyLand();
            break;
          case "menu":
            curWindow = "menu";
            break;
          case "help":
            curWindow = "help";
            break;
          case "upgrades":
            curWindow = "upgrades";
            break;
          case "stats":
            curWindow = "stats";
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