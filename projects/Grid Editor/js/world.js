function initWorld() {
  world = [];
  createRandomWorld();
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

function saveWorld() {
  // Prints the lz-string compressed save of the world in the console.
  let map = { 'rows': rows, 'cols': cols, 'tileSizeFull': tileSizeFull, walls: [] };
  for (let col = 0; col < cols; col++) {
    map.walls[col] = [];
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      map.walls[col][row] = tile.wall;
    }
  }

  const compressed = LZString.compressToUTF16(JSON.stringify(map));
  console.log(compressed);
  print('This is the string of the map! Load the map by copying this string to ../js/maps.js in maps[n].')
}