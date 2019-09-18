// Editable!
let debugging = true;
let waveActive = false;
const rows = 26;
const cols = 25;
const size = 25;

// Not editable.
const width = cols * size;
const height = rows * size;
let world;
let player;
let enemy;
let scrollingTextWave;
let tileContainsPlayer;
let wave = 1;

function setup() {
  createButton('Debug').mousePressed(function() {
    debugging = !debugging;
  });
  createButton('waveActive').mousePressed(function() {
    waveActive = !waveActive;
  });

  createCanvas(width, height);
  createWorldArray();
  player = new Player(floor(cols / 2), floor(rows / 2));
  enemy = new Enemy(0, 0);
  tileContainsPlayer = player.getTileContainsPlayer();
  scrollingTextWave = new ScrollingText();
}

function draw() {
  let tStart;
  if (debugging) {
    // Start recording the time draw() takes to run.
    tStart = performance.now();
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

  player.draw();
  enemy.draw();

  if (!waveActive) {
    scrollingTextWave.scrollText()
  }

  if (debugging) {
    debug(tStart);
  }
}