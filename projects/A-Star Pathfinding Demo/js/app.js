// Editable!
let debugging = true;
let showScrollWave = false;
let slidingEnemies = true;
let diagonalNeighbors = false;
let showSets = false;
let showPath = true;
let fullView = true;

const randomMap = false;
const rows = 50;
const cols = 50;
const tileSize = 10;

// Not editable.
const width = cols * tileSize;
const height = rows * tileSize;

const restrictedViewDiameter = 5; // The diameter of how many tiles the user can see, with the player's position always in the center.
const tileSizeRestricted = width / restrictedViewDiameter;
let waveActive = false;
const enemySpeed = 6; // In movements per second.

let world;
let player;
let enemies = [];
let scrollingTextWave;

let tileContainsPlayer;

// The starting wave number is always 1.
let wave = 1;

function setup() {
  createCanvas(width, height);
  createButtons();
  createWorldArray();
  createObjects();
}

function draw() {
  // Saves the time whenever this function starts being executed.
  const tStart = performance.now();

  calculate();
  show(tStart);
}

function calculate() {
  if (waveActive || showScrollWave === false) {
    if (keyIsPressed) {
      checkKeyIsDown()
      // Only call the pathfind function when the player stands on a new tile.
      const temp = player.getTileContainsPlayer();
      if (temp !== tileContainsPlayer) {
        for (const enemy of enemies) {
          // This line is absolutely necessary, otherwise pathfind will use the previous tileContainsPlayer!
          tileContainsPlayer = temp;
          // Find a new path for the enemy to take when the player has moved.
          enemy.pathfind();
        }
      }
      tileContainsPlayer = temp;
    }
  }

  for (const enemy of enemies) {
    enemy.getPathFromEnemyToPlayer();
  }

  for (const enemy of enemies) {
    enemy.move();
  }
}

function show(tStart) {
  background(200);

  if (fullView) {
    showWalls();

    if (showSets) {
      for (const enemy of enemies) {
        enemy.showOpenSet();
      }
      for (const enemy of enemies) {
        enemy.showClosedSet();
      }
    }

    if (showPath) {
      for (const enemy of enemies) {
        enemy.showPath();
      }
    }

    tileContainsPlayer.showContainsPlayer();

    player.show();

    for (const enemy of enemies) {
      enemy.show();
    }

    if (!waveActive && showScrollWave) {
      scrollingTextWave.scrollText()
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

    const offset = (restrictedViewDiameter - 1) / 2 + 1 // 5, 4, 2, 3 or 7, 6, 3, 4 or 9, 8, 4, 5
    const minColRow = tileContainsPlayer.col - offset; // It doesn't matter whether we take the .col or .row here.
    const maxColRow = tileContainsPlayer.col + offset;

    for (let col = minColRow; col <= maxColRow; col++) {
      for (let row = minColRow; row <= maxColRow; row++) {
        // Draw each tile in the restricted view.
        const tile = world[col][row];
        if (tile.wall) {
          tile.show();
        }
      }
    }

    tileContainsPlayer.showContainsPlayer();

    player.show();

    // for (const enemy of enemies) {
    //   enemy.show();
    // }
  }

  if (debugging) {
    showDebug(tStart);
  }
}

function createObjects() {
  player = new Player(floor((cols) / 2), floor((rows) / 2));

  tileContainsPlayer = player.getTileContainsPlayer();

  createEnemies();
  for (const enemy of enemies) {
    enemy.pathfind(tileContainsPlayer);
  }

  scrollingTextWave = new ScrollingText();
}

function createEnemies() {
  enemies.push(new Enemy(0, 0, 0));
  enemies.push(new Enemy(cols - 1, 0, 1));
  enemies.push(new Enemy(cols - 1, rows - 1, 2));
  enemies.push(new Enemy(0, rows - 1, 3));
}

function showWalls() {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      if (tile.wall) {
        tile.show();
      }
    }
  }
}

function getRestrictedViewCoordinates(_x, _y) {
  // THIS SHOULD BE MODIFIED SO IT'S CENTERED ON THE PLAYER!!
  const newZero = (rows - 1) / 2 * tileSize; // Gets the top-left corner of the middle tile in the full world view.
  const middle = (restrictedViewDiameter - 1) / 2 * tileSizeRestricted - tileSizeRestricted / 2; // 4 * tileSizeRD + tileSizeRD / 2.
  const mult = rows / restrictedViewDiameter; // How many times bigger tileSizeRD is than tileSize. I think... (zzzz...)
  const x = middle + (_x - newZero) * mult;
  const y = middle + (_y - newZero) * mult;
  return { 'x': x, 'y': y }
}