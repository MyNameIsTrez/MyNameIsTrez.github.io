function checkKeyIsDown() {
  if (keyIsDown(kbs.w) || keyIsDown(kbs.ArrowUp)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x, player.y - 1))) {
        if (player.y >= 1) player.y--;
      }
    }
  }
  if (keyIsDown(kbs.a) || keyIsDown(kbs.ArrowLeft)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x - 1, player.y))) {
        if (player.x >= 1) player.x--;
      }
    }
  }
  if (keyIsDown(kbs.s) || keyIsDown(kbs.ArrowDown)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x, player.y + 1))) {
        if (player.y <= rows * tileSizeFull - 2) player.y++;
      }
    }
  }
  if (keyIsDown(kbs.d) || keyIsDown(kbs.ArrowRight)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x + 1, player.y))) {
        if (player.x <= cols * tileSizeFull - 2) player.x++;
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
      if (randomMap) {
        let worldWalls = [];
        for (let col = 0; col < cols; col++) {
          worldWalls[col] = [];
          for (let row = 0; row < rows; row++) {
            worldWalls[col][row] = world[col][row].wall;
          }
        }
        saveJSON(worldWalls, 'map');
        print('Saved!')
      }
      break;
  }
}