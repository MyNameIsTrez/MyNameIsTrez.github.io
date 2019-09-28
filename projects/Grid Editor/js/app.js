// ------------------------------------------------------------
// Editable!
let debugging = true;
// ------------------------------------------------------------


// ------------------------------------------------------------
// Not editable.

// THIS SHOULD BE REWRITTEN ASAP!!! Currently, the size of the window is always the same!
var rows = 50;
var cols = 50;
var tileSizeFull = 11.5;
var wallPercentage = 30;

const debugUpdateInterval = 0.25; // In seconds.

const width = cols * tileSizeFull;
const height = rows * tileSizeFull;

let world;

let startTime;
let msAverage;
// ------------------------------------------------------------

function setup() {
  createCanvas(width, height);
  createButtons();
  initWorld();
}

function draw() {
  show();
}

function show() {
  background(200);

  showWalls();

  if (debugging) {
    showDebug();
  }
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