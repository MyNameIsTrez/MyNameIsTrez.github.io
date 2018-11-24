function up() {
  switch (curWindow) {
    case 'game':
      switch (lmbWindow) {
        case 'game':
          if (cursor.gameY >= cellWH) {
            cursor.gameY -= cellWH;
          }
          break;
        case 'previews':
          for (let key in buildings) {
            // if the selectedBuilding.game is not at the top of the colomn
            if ((buildings[selectedBuilding.game][0] + 1) / previewColumns > 1) {
              // if the key's index is equal to the index of selectedBuilding.game - previewRows
              if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding.game) - previewColumns) {
                selectedBuilding.game = key;
                break;
              }
            }
          }
          break;
        case 'buttons':
          switch (selectedButton.game) {
            case 'upgrades':
              selectedButton.game = 'stats';
              break;
            case 'buy_land':
              selectedButton.game = 'upgrades';
              break;
            case 'menu':
              selectedButton.game = 'buy_land';
              break;
            case 'help':
              selectedButton.game = 'buy_land';
              break;
          }
          break;
      }
      break;
    case 'upgrades':
      switch (selectedButton.upgrades) {
        case 'house':
          selectedButton.upgrades = 'farm';
          break;
        case 'office':
          selectedButton.upgrades = 'house';
          break;
        case 'laboratory':
          selectedButton.upgrades = 'office';
          break;
        case 'windmill':
          selectedButton.upgrades = 'laboratory';
          break;
        case 'uranium_mine':
          selectedButton.upgrades = 'windmill';
          break;
        case 'reactor':
          selectedButton.upgrades = 'uranium_mine';
          break;
      }
      break;
  }
}


function left() {
  switch (curWindow) {
    case 'game':
      switch (lmbWindow) {
        case 'game':
          if (cursor.gameX >= cellWH + GUIW) {
            cursor.gameX -= cellWH;
          }
          break;
        case 'previews':
          for (key in buildings) {
            // if the selectedBuilding.game is not at the beginning of the row
            if ((buildings[selectedBuilding.game][0]) / previewColumns % 1) {
              // if the key's index is equal to the index of selectedBuilding.game - 1
              if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding.game) - 1) {
                selectedBuilding.game = key;
                break;
              }
            }
          }
          break;
        case 'buttons':
          switch (selectedButton.game) {
            case 'help':
              selectedButton.game = 'menu';
              break;
          }
          break;
      }
      break;
  }
}


function down() {
  switch (curWindow) {
    case 'game':
      switch (lmbWindow) {
        case 'game':
          if (cursor.gameY < height - cellWH - 1) {
            cursor.gameY += cellWH;
          }
          break;
        case 'previews':
          for (key in buildings) {
            // if the selectedBuilding.game is not at the bottom of the colomn
            if ((buildings[selectedBuilding.game][0] + 1) / previewColumns <= previewColumns - 1) {
              // if the key's index is equal to the index of selectedBuilding.game + previewRows
              if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding.game) + previewColumns) {
                selectedBuilding.game = key;
                break;
              }
            }
          }
          break;
        case 'buttons':
          switch (selectedButton.game) {
            case 'stats':
              selectedButton.game = 'upgrades';
              break;
            case 'upgrades':
              selectedButton.game = 'buy_land';
              break;
            case 'buy_land':
              selectedButton.game = 'menu';
              break;
            case 'buy_land':
              selectedButton.game = 'help';
              break;
          }
          break;
      }
      break;
    case 'upgrades':
      switch (selectedButton.upgrades) {
        case 'farm':
          selectedButton.upgrades = 'house';
          break;
        case 'house':
          selectedButton.upgrades = 'office';
          break;
        case 'office':
          selectedButton.upgrades = 'laboratory';
          break;
        case 'laboratory':
          selectedButton.upgrades = 'windmill';
          break;
        case 'windmill':
          selectedButton.upgrades = 'uranium_mine';
          break;
        case 'uranium_mine':
          selectedButton.upgrades = 'reactor';
          break;
      }
      break;
  }
}


function right() {
  switch (curWindow) {
    case 'game':
      switch (lmbWindow) {
        case 'game':
          if (cursor.gameX < width - cellWH - 1) {
            cursor.gameX += cellWH;
          }
          break;
        case 'previews':
          for (key in buildings) {
            // if the selectedBuilding is not at the end of the row
            if ((buildings[selectedBuilding.game][0] + 1) / previewColumns % 1) {
              // if the key's index is equal to the index of selectedBuilding.game + 1
              if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding.game) + 1) {
                selectedBuilding.game = key;
                break;
              }
            }
          }
          break;
        case 'buttons':
          switch (selectedButton.game) {
            case 'menu':
              selectedButton.game = 'help';
              break;
          }
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
      lmbWindow = 'game';
      break;
    case 75: // k
      lmbWindow = 'previews';
      break;
    case 76: // l
      lmbWindow = 'buttons';
      break;
    case 69: // e, activate
      switch (curWindow) {
        case 'game':
          switch (lmbWindow) {
            case 'game':
              cells
              [cursor.gameY / cellWH][(Math.floor(cursor.gameX - GUIW)) / cellWH + 1]
                .newBuilding(selectedBuilding.game); // place/remove selected building
              break;
            case 'previews':
              lmbWindow = 'game';
              break;
            case 'buttons':
              switch (selectedButton.game) {
                case 'buy_land':
                  buyLand();
                  break;
                case 'menu':
                  curWindow = 'menu';
                  break;
                case 'help':
                  curWindow = 'help';
                  break;
                case 'upgrades':
                  curWindow = 'upgrades';
                  break;
                case 'stats':
                  curWindow = 'stats';
                  break;
              }
              break;
          }
          break;
        case 'upgrades':

          break;
      }
      break;
    case 27: // escape
      curWindow = 'game';
      break;
  }

  if (lmbWindow === 'game') {
    // sets a cell to a building that corresponds to the key the user pressed
    for (let building in buildings) {
      if (keyCode === buildings[building][1]) {
        // the keycode for the number 3 is 51, so 51 - 49 = 2, building three.
        selectedBuilding.game = building;
      }
    }
  }
}