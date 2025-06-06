// ------------------------------------------------------------
// Editable.
let rows = 25;
let cols = 25;
let tileSize = 23;
// ------------------------------------------------------------

// ------------------------------------------------------------
// Not editable.
let world;
let firstTilePressedCopy;
let selection = 'wall';
console.log('Selected the wall type.');
// ------------------------------------------------------------

function setup() {
  const width = cols * tileSize;
  const height = rows * tileSize;
  createCanvas(width, height);
  initWorld();
  show();
  createInputs();
}

function draw() {
  if (mouseIsPressed) {
    changeTile();
  }
}

function show() {
  background(200);
  showWalls();
}

function showWalls() {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      if (tile.type !== 'empty') {
        tile.show();
      }
    }
  }
}