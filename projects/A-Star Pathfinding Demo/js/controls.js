function checkKeyIsDown() {
  if (keyIsDown(kbs.w) || keyIsDown(kbs.arrowUp)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x, player.y - 1))) {
        if (player.y >= 1) player.y--;
      }
    }
  }
  if (keyIsDown(kbs.a) || keyIsDown(kbs.arrowLeft)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x - 1, player.y))) {
        if (player.x >= 1) player.x--;
      }
    }
  }
  if (keyIsDown(kbs.s) || keyIsDown(kbs.arrowDown)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x, player.y + 1))) {
        // The player can't hit the right and bottom edge of the map in restricted mode,
        // the problem probably lies somewhere here.
        // if (fullView) {
        if (player.y <= rows * tileSizeFull - 2) player.y++;
        // } else {
        // if (player.y <= rows * tileSizeRestricted - 2) player.y++;
        // }
      }
    }
  }
  if (keyIsDown(kbs.d) || keyIsDown(kbs.arrowRight)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x + 1, player.y))) {
        // The player can't hit the right and bottom edge of the map in restricted mode,
        // the problem probably lies somewhere here.
        // if (fullView) {
        if (player.x <= cols * tileSizeFull - 2) player.x++;
        // } else {
        // if (player.x <= cols * tileSizeRestricted - 2) player.x++;
        // }
      }
    }
  }
}

function isTileWall(x, y) {
  const col = floor(x / tileSizeFull);
  const row = floor(y / tileSizeFull);
  // Prevents checking a tile outside of world.
  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    return world[col][row].wall;
  } else {
    return false;
  }
}

function keyPressed() {
  switch (key) {
    case 'm':
      saveWorld();
      break;
  }
}