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
      switch (selectedButton.upgrades) {
        case 'house_1':
          selectedButton.upgrades = 'farm_1';
          break;
        case 'office_1':
          selectedButton.upgrades = 'house_1';
          break;
        case 'laboratory_1':
          selectedButton.upgrades = 'office_1';
          break;
        case 'windmill_1':
          selectedButton.upgrades = 'laboratory_1';
          break;
        case 'uranium_mine_1':
          selectedButton.upgrades = 'windmill_1';
          break;
        case 'reactor_1':
          selectedButton.upgrades = 'uranium_mine_1';
          break;

        case 'house_2':
          selectedButton.upgrades = 'farm_2';
          break;
        case 'office_2':
          selectedButton.upgrades = 'house_2';
          break;
        case 'laboratory_2':
          selectedButton.upgrades = 'office_2';
          break;
        case 'windmill_2':
          selectedButton.upgrades = 'laboratory_2';
          break;
        case 'uranium_mine_2':
          selectedButton.upgrades = 'windmill_2';
          break;
        case 'reactor_2':
          selectedButton.upgrades = 'uranium_mine_2';
          break;


        case 'house_3':
          selectedButton.upgrades = 'farm_3';
          break;
        case 'office_3':
          selectedButton.upgrades = 'house_3';
          break;
        case 'laboratory_3':
          selectedButton.upgrades = 'office_3';
          break;
        case 'windmill_3':
          selectedButton.upgrades = 'laboratory_3';
          break;
        case 'uranium_mine_3':
          selectedButton.upgrades = 'windmill_3';
          break;
        case 'reactor_3':
          selectedButton.upgrades = 'uranium_mine_3';
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
      switch (selectedButton.upgrades) {
        case 'farm_1':
          selectedButton.upgrades = 'house_1';
          break;
        case 'house_1':
          selectedButton.upgrades = 'office_1';
          break;
        case 'office_1':
          selectedButton.upgrades = 'laboratory_1';
          break;
        case 'laboratory_1':
          selectedButton.upgrades = 'windmill_1';
          break;
        case 'windmill_1':
          selectedButton.upgrades = 'uranium_mine_1';
          break;
        case 'uranium_mine_1':
          selectedButton.upgrades = 'reactor_1';
          break;

        case 'farm_2':
          selectedButton.upgrades = 'house_2';
          break;
        case 'house_2':
          selectedButton.upgrades = 'office_2';
          break;
        case 'office_2':
          selectedButton.upgrades = 'laboratory_2';
          break;
        case 'laboratory_2':
          selectedButton.upgrades = 'windmill_2';
          break;
        case 'windmill_2':
          selectedButton.upgrades = 'uranium_mine_2';
          break;
        case 'uranium_mine_2':
          selectedButton.upgrades = 'reactor_2';
          break;

        case 'farm_3':
          selectedButton.upgrades = 'house_3';
          break;
        case 'house_3':
          selectedButton.upgrades = 'office_3';
          break;
        case 'office_3':
          selectedButton.upgrades = 'laboratory_3';
          break;
        case 'laboratory_3':
          selectedButton.upgrades = 'windmill_3';
          break;
        case 'windmill_3':
          selectedButton.upgrades = 'uranium_mine_3';
          break;
        case 'uranium_mine_3':
          selectedButton.upgrades = 'reactor_3';
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
    case 'upgrades':
      switch (selectedButton.upgrades) {
        case 'farm_2':
          selectedButton.upgrades = 'farm_1';
          break;
        case 'house_2':
          selectedButton.upgrades = 'house_1';
          break;
        case 'office_2':
          selectedButton.upgrades = 'office_1';
          break;
        case 'laboratory_2':
          selectedButton.upgrades = 'laboratory_1';
          break;
        case 'windmill_2':
          selectedButton.upgrades = 'windmill_1';
          break;
        case 'uranium_mine_2':
          selectedButton.upgrades = 'uranium_mine_1';
          break;
        case 'reactor_2':
          selectedButton.upgrades = 'reactor_1';
          break;

        case 'farm_3':
          selectedButton.upgrades = 'farm_2';
          break;
        case 'house_3':
          selectedButton.upgrades = 'house_2';
          break;
        case 'office_3':
          selectedButton.upgrades = 'office_2';
          break;
        case 'laboratory_3':
          selectedButton.upgrades = 'laboratory_2';
          break;
        case 'windmill_3':
          selectedButton.upgrades = 'windmill_2';
          break;
        case 'uranium_mine_3':
          selectedButton.upgrades = 'uranium_mine_2';
          break;
        case 'reactor_3':
          selectedButton.upgrades = 'reactor_2';
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
    case 'upgrades':
      switch (selectedButton.upgrades) {
        case 'farm_1':
          selectedButton.upgrades = 'farm_2';
          break;
        case 'house_1':
          selectedButton.upgrades = 'house_2';
          break;
        case 'office_1':
          selectedButton.upgrades = 'office_2';
          break;
        case 'laboratory_1':
          selectedButton.upgrades = 'laboratory_2';
          break;
        case 'windmill_1':
          selectedButton.upgrades = 'windmill_2';
          break;
        case 'uranium_mine_1':
          selectedButton.upgrades = 'uranium_mine_2';
          break;
        case 'reactor_1':
          selectedButton.upgrades = 'reactor_2';
          break;

        case 'farm_2':
          selectedButton.upgrades = 'farm_3';
          break;
        case 'house_2':
          selectedButton.upgrades = 'house_3';
          break;
        case 'office_2':
          selectedButton.upgrades = 'office_3';
          break;
        case 'laboratory_2':
          selectedButton.upgrades = 'laboratory_3';
          break;
        case 'windmill_2':
          selectedButton.upgrades = 'windmill_3';
          break;
        case 'uranium_mine_2':
          selectedButton.upgrades = 'uranium_mine_3';
          break;
        case 'reactor_2':
          selectedButton.upgrades = 'reactor_3';
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
          switch (selectedButton.upgrades) {
            case 'farm_1':
              console.log('farm_1');
              farm_upgrade_level = 1;
              break;
            case 'house_1':
              console.log('house_1');
              house_upgrade_level = 1;
              break;
            case 'office_1':
              console.log('office_1');
              office_upgrade_level = 1;
              break;
            case 'laboratory_1':
              console.log('laboratory_1');
              laboratory_upgrade_level = 1;
              break;
            case 'windmill_1':
              console.log('windmill_1');
              windmill_upgrade_level = 1;
              break;
            case 'uranium_mine_1':
              console.log('uranium_mine_1');
              uranium_mine_upgrade_level = 1;
              break;
            case 'reactor_1':
              console.log('reactor_1');
              reactor_upgrade_level = 1;
              break;

            case 'farm_2':
              console.log('farm_2');
              farm_upgrade_level = 2;
              break;
            case 'house_2':
              console.log('house_2');
              house_upgrade_level = 2;
              break;
            case 'office_2':
              console.log('office_2');
              office_upgrade_level = 2;
              break;
            case 'laboratory_2':
              console.log('laboratory_2');
              laboratory_upgrade_level = 2;
              break;
            case 'windmill_2':
              console.log('windmill_2');
              windmill_upgrade_level = 2;
              break;
            case 'uranium_mine_2':
              console.log('uranium_mine_2');
              uranium_mine_upgrade_level = 2;
              break;
            case 'reactor_2':
              console.log('reactor_2');
              reactor_upgrade_level = 2;
              break;

            case 'farm_3':
              console.log('farm_3');
              farm_upgrade_level = 3;
              break;
            case 'house_3':
              console.log('house_3');
              house_upgrade_level = 3;
              break;
            case 'office_3':
              console.log('office_3');
              office_upgrade_level = 3;
              break;
            case 'laboratory_3':
              console.log('laboratory_3');
              laboratory_upgrade_level = 3;
              break;
            case 'windmill_3':
              console.log('windmill_3');
              windmill_upgrade_level = 3;
              break;
            case 'uranium_mine_3':
              console.log('uranium_mine_3');
              uranium_mine_upgrade_level = 3;
              break;
            case 'reactor_3':
              console.log('reactor_3');
              reactor_upgrade_level = 3;
              break;
          }
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