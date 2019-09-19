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
let enemy;
let scrollingTextWave;

let tileContainsPlayer;

let wave = 1;

let openSet = [];
let closedSet = [];
let start;
let current;

function setup() {
  createButtons();
  createCanvas(width, height);
  createWorldArray();
  createObjects();

  start = world[0][0];
  start.wall = false;
  world[cols - 1][rows - 1].wall = false;

  pathfind(tileContainsPlayer);
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
        pathfind(temp);
      }
      tileContainsPlayer = temp;
    }
  }

  showSets();
  tileContainsPlayer.drawContainsPlayer();
  showPath();

  player.show();
  enemy.show();

  if (!waveActive) {
    scrollingTextWave.scrollText()
  }

  if (debugging) {
    debug(tStart);
  }
}

function createObjects() {
  player = new Player(cols - 1, rows - 1);
  enemy = new Enemy(0, 0);
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