// Editable!
let debugging = true;
let slidingEnemies = true;
let waveActive = false;
let diagonalNeighbors = false;
let scrollWaveActive = false;
let showSets = false;
let showPath = true;
const randomMap = false;
const rows = 50;
const cols = 50;
const tileSize = 10;
const enemySpeed = 6; // In movements per second.

// Not editable.
const width = cols * tileSize;
const height = rows * tileSize;

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
  if (waveActive || scrollWaveActive === false) {
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

  if (!waveActive && scrollWaveActive) {
    scrollingTextWave.scrollText()
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