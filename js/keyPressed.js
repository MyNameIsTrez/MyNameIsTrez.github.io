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
      // stores the button name above the currently selected button (farm, house)
      let buttonUp = Object.keys(upgrades)[
        Object.keys(upgrades).indexOf(
          selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 2)
        ) - 1]

      // stores the button name above the currently selected button with '_upgrade_level' at the end
      let buttonUpUpgradeLevel = window[buttonUp + '_upgrade_level']

      if (buttonUpUpgradeLevel < 3) {
        selectedButton.upgrades = buttonUp + '_' + (buttonUpUpgradeLevel + 1);
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
      // stores the button name above the currently selected button (farm, house)
      let buttonDown = Object.keys(upgrades)[
        Object.keys(upgrades).indexOf(
          selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 2)
        ) + 1]

      // stores the button name above the currently selected button with '_upgrade_level' at the end
      let buttonDownUpgradeLevel = window[buttonDown + '_upgrade_level']

      if (buttonDownUpgradeLevel < 3) {
        selectedButton.upgrades = buttonDown + '_' + (buttonDownUpgradeLevel + 1);
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
            // if the selectedBuilding is not at the beginning of the row
            if ((buildings[selectedBuilding][0]) / previewColumns % 1) {
              // if the key's index is equal to the index of selectedBuilding - 1
              if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding) - 1) {
                selectedBuilding = key;
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
            if ((buildings[selectedBuilding][0] + 1) / previewColumns % 1) {
              // if the key's index is equal to the index of selectedBuilding + 1
              if (activePreviews.indexOf(key) === activePreviews.indexOf(selectedBuilding) + 1) {
                selectedBuilding = key;
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
    case 83: // down
      down()
      break;
    case 65: // left
      left()
      break;
    case 68: // right
      right()
      break;

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
                .newBuilding(selectedBuilding); // place/remove selected building
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
          buyUpgrade();
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
        selectedBuilding = building;
      }
    }
  }
}