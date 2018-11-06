function keyPressed() {
  switch (keyCode) {
    case 87: // up
      if (player.y >= cellWH) {
        player.y -= cellWH;
      }
      break;
    case 65: // left
      if (player.x >= cellWH + GUIWidth) {
        player.x -= cellWH;
      }
      break;
    case 83: // down
      if (player.y < height - cellWH - 1) {
        player.y += cellWH;
      }
      break;
    case 68: // right
      if (player.x < width - cellWH - 1) {
        player.x += cellWH;
      }
      break;
    case UP_ARROW: // up
      if (player.y >= cellWH) {
        player.y -= cellWH;
      }
      break;
    case LEFT_ARROW: // left
      if (player.x >= cellWH + GUIWidth) {
        player.x -= cellWH;
      }
      break;
    case DOWN_ARROW: // down
      if (player.y < height - cellWH - 1) {
        player.y += cellWH;
      }
      break;
    case RIGHT_ARROW: // right
      if (player.x < width - cellWH - 1) {
        player.x += cellWH;
      }
      break;
    case 66: // b, buys cells on the right and bottom
      buyLand();
      break;
    case 69: // e, place/remove building
      if (lmbMode === "placing") {
        cells
          [player.y / cellWH][(Math.floor(player.x - GUIWidth)) / cellWH + 1]
          .newBuilding(lmbBuilding); // place selected building
      } else if (lmbMode === "removing") {
        cells
          [player.y / cellWH][(Math.floor(player.x - GUIWidth)) / cellWH + 1]
          .newBuilding("empty"); // replace building with an empty cell
      }
      break;
    case 27: // escape
      curWindow = "game";
      break;
  }

  // sets a cell to a building that corresponds to the key the user pressed

  for (let i in buildings) {
    if (keyCode === buildings[i][1]) {
      if (lmbMode === "removing") {
        lmbMode = "placing";
      }

      // the keycode for the number 3 is 51, so 51 - 49 = 2, building three.
      lmbBuilding = i;
    }
  }
}