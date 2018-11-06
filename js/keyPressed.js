function keyPressed() {
  switch (keyCode) {
    case 87: // up
      if (lmbWindow === "game") {
        if (player.gameY >= cellWH) {
          player.gameY -= cellWH;
        }
      } else if (lmbWindow === "GUI") {
        // console.log(Object.keys(buildings)[2]); // office
        // console.log(Object.keys(buildings)["office"]); // undefined
        // console.log(Object.values(buildings)); // [Array(2), Array(2), Array(2)...]
        // console.log(buildings["office"]); // [2, 51]
        // console.log(buildings["office"].indexOf(51)); // 1
        // console.log(buildings["office"][0]); // 2
        // console.log(buildings[lmbBuilding][0] + 1); // 1, 2, 3...
        // for (key in buildings) {
        //   console.log(key); // farm, house, office...
        // }
      }
      break;
    case 65: // left
      if (lmbWindow === "game") {
        if (player.gameX >= cellWH + GUIWidth) {
          player.gameX -= cellWH;
        }
      } else if (lmbWindow === "GUI") {

      }
      break;
    case 83: // down
      if (lmbWindow === "game") {
        if (player.gameY < height - cellWH - 1) {
          player.gameY += cellWH;
        }
      } else if (lmbWindow === "GUI") {

      }
      break;
    case 68: // right
      if (lmbWindow === "game") {
        if (player.gameX < width - cellWH - 1) {
          player.gameX += cellWH;
        }
      } else if (lmbWindow === "GUI") {
        for (key in buildings) {
          // if the lmbBuilding is not at the end of the row
          if (Math.floor((buildings[lmbBuilding][0] + 1) / maxPreviewRow % 1 !== 0)) {
            if (buildings[key][0] === buildings[lmbBuilding][0] + 1) {
              lmbBuilding = key;
              break;
            }
          }
        }
      }
      break;
    case UP_ARROW: // up
      if (lmbWindow === "game") {
        if (player.gameY >= cellWH) {
          player.gameY -= cellWH;
        }
      } else if (lmbWindow === "GUI") {

      }
      break;
    case LEFT_ARROW: // left
      if (lmbWindow === "game") {
        if (player.gameX >= cellWH + GUIWidth) {
          player.gameX -= cellWH;
        }
      }
      break;
    case DOWN_ARROW: // down
      if (lmbWindow === "game") {
        if (player.gameY < height - cellWH - 1) {
          player.gameY += cellWH;
        }
      }
      break;
    case RIGHT_ARROW: // right
      if (lmbWindow === "game") {
        if (player.gameX < width - cellWH - 1) {
          player.gameX += cellWH;
        }
      }
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