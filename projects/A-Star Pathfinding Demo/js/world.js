function createWorld() {
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
  for (let col = 0; col < cols; col++) {
    world[col] = [];
    for (let row = 0; row < rows; row++) {
      world[col][row] = new Tile(col, row, maps[booleanWorldIndex][col][row]);
    }
  }
}

function saveWorld() {
  // Save the world to a '<name>.json' file, which the user has to rename to '<name>.js'.
  if (randomMap) {
    let worldWalls = [];
    for (let col = 0; col < cols; col++) {
      worldWalls[col] = [];
      for (let row = 0; row < rows; row++) {
        worldWalls[col][row] = world[col][row].wall;
      }
    }
    
    const compressed = LZString.compress(JSON.stringify(worldWalls));
    console.log(compressed);
    print('This is the string of the map! Load the map by saving this string to ../js/maps.js in maps[].')
  }
}

function addWorldNeighbors() {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      world[col][row].addNeighbors();
    }
  }
}