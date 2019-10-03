function checkKeyIsDown() {
  if (keyIsDown(kbs.w) || keyIsDown(kbs.arrowUp)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x, player.y - 1))) {
        if (player.y >= 1) player.changeY(-1);
      }
    }
  }

  if (keyIsDown(kbs.a) || keyIsDown(kbs.arrowLeft)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x - 1, player.y))) {
        if (player.x >= 1) player.changeX(-1);
      }
    }
  }

  if (keyIsDown(kbs.s) || keyIsDown(kbs.arrowDown)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (!(isTileWall(player.x, player.y + 1))) {
        // The player can't hit the right and bottom edge of the map in restricted mode,
        // the problem probably lies somewhere here.
        // if (fullView) {
        if (player.y <= rows * tileSizeFull - 2) player.changeY(1);
        // } else {
        // if (player.y <= rows * tileSizeRestricted - 2) player.changeY(1);
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
        if (player.x <= cols * tileSizeFull - 2) player.changeX(1);
        // } else {
        // if (player.x <= cols * tileSizeRestricted - 2) player.changeX(1);
        // }
      }
    }
  }
}

function keyPressed() {
  if (keyIsDown(kbs.place)) {
    const tile = world[player.col][player.row];
    switch (selected) {
      // case 'wall':
      //   if (!tile.wall) {
      //     console.log('The player can now select which direction the wall should be placed at.');
      //     tile.wall = !tile.wall;
      //   }
      //   break;
      case 'turret':
        if (!tile.turret) {
          const turret = new Turret(player.col, player.row);
          turrets.push(turret);
          tile.turret = turret;
        }
        break;
    }
  }

  if (keyIsDown(kbs.pausePlay)) {
    looping = !looping;
    if (!looping) {
      noLoop();
    } else {
      loop();
    }
  }

  if (keyIsDown(kbs.nextFrame)) {
    loop();
    noLoop();
  }

  if (keyIsDown(kbs.logInfo)) {
    console.log(waveManager.enemies[0]);
  }

  if (keyIsDown(kbs.clearLogs)) {
    console.clear();
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