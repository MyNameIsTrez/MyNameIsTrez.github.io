// Editable!
let debugging = true;
let waveActive = false;
const rows = 50;
const cols = 50;
const tileSize = 25;

// Not editable.
const width = cols * tileSize;
const height = rows * tileSize;

let world;
let player;
let enemies = [];
let scrollingTextWave;

let tileContainsPlayer;

let wave = 1;

let current;

function setup() {
  createButtons();
  createCanvas(width, height);
  createWorldArray();
  createObjects();

  world[cols - 1][rows - 1].wall = false;

  for (const enemy of enemies) {
    enemy.pathfind(tileContainsPlayer);
  }
}

function draw() {
  let tStart;
  if (debugging) {
    // Start recording the time draw() takes to run.
    tStart = performance.now();
  }

  background(200);
  showWalls();

  if (waveActive) {
    if (keyIsPressed) {
      checkKeyIsDown()
      // Only call the pathfind function when the player stands on a new tile.
      const temp = player.getTileContainsPlayer();
      if (temp !== tileContainsPlayer) {
        for (const enemy of enemies) {
          enemy.pathfind(temp);
        }
      }
      tileContainsPlayer = temp;
    }
  }

  for (const enemy of enemies) {
    enemy.showSets();
    enemy.showPath();
  }
  tileContainsPlayer.drawContainsPlayer();

  player.show();

  for (const enemy of enemies) {
    enemy.show();
  }

  if (!waveActive) {
    scrollingTextWave.scrollText()
  }

  if (debugging) {
    debug(tStart);
  }
}

function createObjects() {
  player = new Player(cols - 1, rows - 1);
  enemies.push(new Enemy(0, 0));
  // Can't add more enemies, unless I allow tiles to have
  // multiple parents!
  // enemies.push(new Enemy(cols - 1, 0));
  tileContainsPlayer = player.getTileContainsPlayer();
  scrollingTextWave = new ScrollingText();
}

function removeFromArray(array, element) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === element) {
      array.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  const d = dist(a.x, a.y, b.x, b.y);
  return d;
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