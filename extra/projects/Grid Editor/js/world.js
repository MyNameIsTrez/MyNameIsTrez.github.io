function initWorld() {
  world = [];
  createEmptyWorld();
}

function createEmptyWorld() {
  for (let col = 0; col < cols; col++) {
    world[col] = [];
    for (let row = 0; row < rows; row++) {
      world[col][row] = new Tile(col, row);
    }
  }
}

function saveWorld() {
  // Prints the lz-string compressed save of the world in the console.

  let map = {
    'rows': rows,
    'cols': cols,
    'tileSizeFull': tileSize,
    'playerSpawn': getplayerSpawn(),
    'enemySpawns': getenemySpawns(),
    'walls': []
  };

  for (let col = 0; col < cols; col++) {
    map.walls[col] = [];
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      map.walls[col][row] = tile.type === 'wall';
    }
  }

  const compressed = LZString.compressToUTF16(JSON.stringify(map));
  console.log(compressed);
  print('This is the string of the map! Load the map by copying this string to ../js/maps.js in maps[n].')
}

function resize() {
  const width = cols * tileSize;
  const height = rows * tileSize;
  resizeCanvas(width, height);
  initWorld();
  show();
}

function getplayerSpawn() {
  // We assume there should only ever be one player.
  let playerSpawn;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      if (tile.type === 'player spawn') {
        playerSpawn = [tile.col, tile.row];
      }
    }
  }
  return playerSpawn;
}

function getenemySpawns() {
  const enemySpawns = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      if (tile.type === 'enemy spawn') {
        enemySpawns.push([tile.col, tile.row]);
      }
    }
  }
  return enemySpawns;
}