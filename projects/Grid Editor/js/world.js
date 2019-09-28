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
  let map = { 'rows': rows, 'cols': cols, 'tileSizeFull': tileSize, tiles: [] };
  for (let col = 0; col < cols; col++) {
    map.tiles[col] = [];
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      map.tiles[col][row] = tile.type;
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