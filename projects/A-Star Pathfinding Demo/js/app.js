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

const restrictedViewDiameter = 9; // The diameter of how many tiles the user can see, with the player's position always in the center.
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
    showWalls();

    tileContainsPlayer.showContainsPlayer();

    player.show();

    for (const enemy of enemies) {
      enemy.show();
    }
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
        world[col][row].show();
      }
    }
  }
}

function getLimitedWorldViewCoordinates(_x, _y) {
  // THIS SHOULD BE MODIFIED SO IT'S CENTERED ON THE PLAYER!!
  const newZero = (rows - 1) / 2 * tileSize; // When the restrictedViewDiameter is 4, this is 4 * tileSize.
  const middle = (restrictedViewDiameter - 1) / 2 * tileSizeRestricted;
  const x = (_x - newZero) * 50 / 9 + middle - tileSizeRestricted / 2;
  const y = (_y - newZero) * 50 / 9 + middle - tileSizeRestricted / 2;
  return { 'x': x, 'y': y }
}