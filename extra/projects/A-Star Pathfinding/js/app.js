// ------------------------------------------------------------
// Editable!
let debugging = true;
let slidingEnemies = true;
let diagonalNeighbors = true;
let showSets = true;
let showPath = true;
let fullView = true;

// Whether you want to create a random map, or load a pre-existing one.
const randomMap = false;

// The index of which map you want to load.
const loadedMapIndex = 1;

// The settings of random maps.
let rows = 50;
let cols = 50;
let tileSizeFull = 11.5;
let wallPercentage = 30;
let playerSpawn = [Math.floor((cols) / 2), Math.floor((rows) / 2)];

const debugUpdateInterval = 0.25; // In seconds.
const showScrollWave = false;
const restrictedViewDiameter = 15; // The diameter of how many tiles the user can see, with the player's position always in the center.
let waveActive = false;
const enemySpeed = 6; // In movements per second.

let enemySpawns = [[0, 0], [cols - 1, 0], [cols - 1, rows - 1], [0, rows - 1]]; // The default enemy spawn locations.

let selected = 'turret';
let enemyCircleRadius = tileSizeFull / 2;

let looping = true;
// ------------------------------------------------------------

// ------------------------------------------------------------
// Not editable.
const width = cols * tileSizeFull;
const height = rows * tileSizeFull;

const tileSizeRestricted = width / restrictedViewDiameter;

let world;
let player;
let turrets = [];
let scrollingTextWave;
let waveManager;

let tileContainsPlayer;

let startTime;
let msAverage;

// The starting wave number is always 1.
let wave = 1;

let newWaveStarted = false;
// ------------------------------------------------------------


function setup() {
  createCanvas(width, height);
  createButtons();
  initWorld();
  createObjects();
}

function draw() {
  calculate();
  show();
}

function calculate() {
  // Start a new wave.
  if (!waveManager.enemies.length) {
    waveManager.newWave();
    console.log('New wave!')
    newWaveStarted = true;
  }

  // if (newWaveCreationComplete) {
  if (waveActive || showScrollWave === false) {
    if (keyIsPressed) {
      checkKeyIsDown();
      getTileContainsPlayerAndUpdateEnemyPathfinding();
    }
  }

  for (const enemy of waveManager.enemies) {
    enemy.getPathFromEnemyToPlayer();
  }

  for (const enemy of waveManager.enemies) {
    enemy.move();
  }

  for (const turret of turrets) {
    turret.update();
  }

  for (const turret of turrets) {
    for (const bullet of turret.bullets) {
      bullet.update();
    }
  }
  // }
}

function show() {
  background(200);

  if (fullView) {
    showWalls();

    if (showSets) {
      // for (const enemy of waveManager.enemies) {
      //   enemy.showOpenSet();
      // }
      for (const enemy of waveManager.enemies) {
        enemy.showClosedSet();
      }
    }

    for (const turret of turrets) {
      turret.show();
    }

    for (const turret of turrets) {
      for (const bullet of turret.bullets) {
        bullet.show();
      }
    }
  } else {
    /*
    If you'd want to see 5x5 tiles, you'd want to actually render 7x7 tiles, with the player always in the center of the screen.
    This is because you need an extra tile at the top, bottom, left and right of the screen,
    to make sure the player can't view outside of the 5x5 tile grid when walking!
    This is why restrictedViewDiameter = 5 actually means 7x7 tiles being rendered behind the scenes. :)

    As you can only ever see up to 6x6 tiles at the same time on the screen,
    it'd be ideal to calculate whether the screen is outside of the 5x5 tile grid,
    so the program can add an extra column/row to the correct side of the screen if so.

    For now, the program is kept simple and just always renders the entire 7x7 grid,
    which it does by getting the tile the player's currently standing on.
    Then we can take the row and column from that tile to calculate which tiles we need to render with a concise formula.

    A visualisation of it here, where 'C' is the center of the screen, which is always centered on the player.
    'v' is the view the player will see when he's perfectly in the center of the middle tile,
    but the player won't be in the centre of a tile most of the time, so 'e' signifies the extra tiles,
    that make sure the player always has his entire screen filled with tiled, even when walking.

    e e e e e e e
    e v v v v v e
    e v v v v v e
    e v v C v v e
    e v v v v v e
    e v v v v v e
    e e e e e e e
    */

    const offset = (restrictedViewDiameter - 1) / 2 + 1; // 5, 4, 2, 3 or 7, 6, 3, 4 or 9, 8, 4, 5
    const minCol = tileContainsPlayer.col - offset;
    const maxCol = tileContainsPlayer.col + offset;
    const minRow = tileContainsPlayer.row - offset;
    const maxRow = tileContainsPlayer.row + offset;

    showWalls(minCol, maxCol, minRow, maxRow);

    if (showSets) {
      for (const enemy of waveManager.enemies) {
        const insideCols = enemy.col >= minCol || enemy.col <= maxCol;
        const insideRows = enemy.row >= minRow || enemy.row <= maxRow;

        if (insideCols && insideRows) {
          enemy.showOpenSet();
        }
      }

      for (const enemy of waveManager.enemies) {
        const insideCols = enemy.col >= minCol || enemy.col <= maxCol;
        const insideRows = enemy.row >= minRow || enemy.row <= maxRow;

        if (insideCols && insideRows) {
          enemy.showClosedSet();
        }
      }
    }
  }

  if (showPath) {
    for (const enemy of waveManager.enemies) {
      enemy.showPath();
    }
  }

  player.show();

  for (const enemy of waveManager.enemies) {
    enemy.show();
  }

  if (!waveActive && showScrollWave) {
    scrollingTextWave.scrollText()
  }

  if (debugging) {
    showDebug();
  }
}

function createObjects() {
  player = new Player(playerSpawn[0], playerSpawn[1]);

  tileContainsPlayer = player.getTileContainsPlayer();

  waveManager = new WaveManager();
  waveManager.newWave();

  scrollingTextWave = new ScrollingText();
}

function showWalls(minCol, maxCol, minRow, maxRow) {
  if (fullView) {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const tile = world[col][row];
        if (tile.wall) {
          tile.show();
        }
      }
    }
  } else {
    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow; row <= maxRow; row++) {
        // Only show existing tiles.
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          const tile = world[col][row];
          if (tile.wall) {
            tile.show();
          }
        } else {
          showEdgeTile(col, row);
        }
      }
    }
  }
}

function getRestrictedViewCoords(_x, _y) {
  // THIS SHOULD BE MODIFIED SO IT IS CENTERED ON THE PLAYER!!
  // const newZero = (rows - 1) / 2 * tileSizeFull; // Gets the top-left corner of the middle tile in the full world view.
  // const middle = (restrictedViewDiameter - 1) / 2 * tileSizeRestricted - tileSizeRestricted / 2; // 4 * tileSizeRestricted + tileSizeRestricted / 2.
  // const mult = cols / restrictedViewDiameter; // How many times bigger tileSizeRestricted is than tileSizeFull.
  // const x = middle + (_x - newZero) * mult;
  // const y = middle + (_y - newZero) * mult;

  /*
  We use the difference between the player's position and the point we're trying to translate to the restricted view.
  
  So if the point we're translating would be (_x, _y) = (5, 0) and the player's position is (17, 0),
  then we do 5 - 17 and 0 - 0 which gets (-12, 0) as the difference.
  
  We then multiply this difference by the ratio between the full view and the restricted view's tile sizes.
  This gets us the restrictedViewOffset, which is the offset of the point from the restricted view's player.
  */

  const fullViewOffset = { 'x': _x - player.x, 'y': _y - player.y };

  // Calculate the ratio between the full view and the restricted view's tile sizes.
  const mult = tileSizeRestricted / tileSizeFull;
  const restrictedViewOffset = { 'x': fullViewOffset.x * mult, 'y': fullViewOffset.y * mult };

  const center = width / 2;
  const x = restrictedViewOffset.x + center;
  const y = restrictedViewOffset.y + center;

  return { 'x': x, 'y': y };
}

function showEdgeTile(col, row) {
  const _x = col * tileSizeFull;
  const _y = row * tileSizeFull;

  push();
  fill(100)
  noStroke();
  if (col === -1 && !(row < -1) && !(row > rows)) {
    const coords = getRestrictedViewCoords(_x, _y);
    square(coords.x, coords.y, tileSizeRestricted);
  }
  if (col === cols && !(row < -1) && !(row > rows)) {
    const coords = getRestrictedViewCoords(_x, _y);
    square(coords.x, coords.y, tileSizeRestricted);
  }
  if (row === -1 && !(col < -1) && !(col > cols)) {
    const coords = getRestrictedViewCoords(_x, _y);
    square(coords.x, coords.y, tileSizeRestricted);
  }
  if (row === rows && !(col < -1) && !(col > cols)) {
    const coords = getRestrictedViewCoords(_x, _y);
    square(coords.x, coords.y, tileSizeRestricted);
  }
  pop();
}

function getTileContainsPlayerAndUpdateEnemyPathfinding() {
  // Only call the pathfind function when the player stands on a new tile.
  const temp = player.getTileContainsPlayer();
  if (temp !== tileContainsPlayer) {
    for (const enemy of waveManager.enemies) {
      // This line is absolutely necessary, otherwise pathfind will use the previous tileContainsPlayer!
      tileContainsPlayer = temp;
      // Find a new path for the enemy to take when the player has moved.
      enemy.pathfind();
    }
  }
  tileContainsPlayer = temp;
}