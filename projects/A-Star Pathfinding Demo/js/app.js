// Editable!
let debugging = true;
let waveActive = false;
const rows = 25;
const cols = 25;
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
let startTile;
let endTile;

function setup() {
  createButtons();
  createCanvas(width, height);
  createWorldArray();
  createObjects();

  startTile = world[0][0];
  endTile = world[cols - 1][rows - 1];
  openSet.push(startTile);
}

function draw() {
  let tStart;
  if (debugging) {
    // Start recording the time draw() takes to run.
    tStart = performance.now();
  }

  if (openSet.length > 0) {
    // Look for a solution.

  } else {
    // No solution.
  }

  background(200);
  drawWorldLines();

  if (waveActive) {
    if (keyIsPressed) {
      checkKeyIsDown()
      tileContainsPlayer = player.getTileContainsPlayer();
    }
  }

  tileContainsPlayer.drawContainsPlayer();

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