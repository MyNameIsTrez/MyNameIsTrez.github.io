function initWorld() {
  world = [];
  if (randomMap) {
    createRandomWorld();
  } else {
    loadWorld();
  }
  addWorldNeighbors();
}

function createRandomWorld() {
  for (let col = 0; col < cols; col++) {
    world[col] = [];
    for (let row = 0; row < rows; row++) {
      const wall = random(1) < (wallPercentage / 100);
      world[col][row] = new Tile(col, row, wall);
    }
  }
}

function loadWorld() {
  const map = JSON.parse(LZString.decompressFromUTF16(maps[loadedMapIndex]));
  rows = map.rows;
  cols = map.cols;
  tileSizeFull = map.tileSizeFull;

  for (let col = 0; col < cols; col++) {
    world[col] = [];
    for (let row = 0; row < rows; row++) {
      world[col][row] = new Tile(col, row, map.tiles[col][row]);
    }
  }

  console.log(world);
}

function saveWorld() {
  // Prints the lz-string compressed save of the world in the console.
  // if (randomMap) {
  let map = { 'rows': rows, 'cols': cols, 'tileSizeFull': tileSizeFull, tiles: [] };
  for (let col = 0; col < cols; col++) {
    map.tiles[col] = [];
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      map.tiles[col][row] = tile.wall;
    }
  }

  const compressed = LZString.compressToUTF16(JSON.stringify(map));
  console.log(compressed);
  print('This is the string of the map! Load the map by copying this string to ../js/maps.js in maps[n].')
  // } else {
  //   print('You can\'t save a map that\'s already in maps[]!');
  // }
}

function addWorldNeighbors() {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      world[col][row].addNeighbors();
    }
  }
}