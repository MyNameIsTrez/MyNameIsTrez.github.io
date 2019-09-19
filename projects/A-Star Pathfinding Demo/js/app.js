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
let end;
let path = [];
let current;

function setup() {
  createButtons();
  createCanvas(width, height);
  createWorldArray();
  createObjects();

  start = world[0][0];
  end = world[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
  openSet.push(start);
}

function draw() {
  let tStart;
  if (debugging) {
    // Start recording the time draw() takes to run.
    tStart = performance.now();
  }

  if (openSet.length > 0) {
    // Look for the index of the Tile with the lowest fScore.
    let currentIndex = 0; // Assume the first Tile in openSet has the lowest fScore.
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIndex].f) {
        currentIndex = i;
      }
    }
    current = openSet[currentIndex];

    if (current === end) {
      noLoop();
      console.log("Done!");
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    const neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        const tempG = current.g + 1; // Shouldn't this be current.g + heuristic(neighbour, end)?

        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
          newPath = true;
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
        }
      }
    }
  } else {
    // No solution.
    console.log("No solution!");
    noLoop();
    // return;
  }

  background(200);

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const tile = world[col][row];
      if (tile.wall) {
        world[col][row].show();
      }
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  // Find the path.
  path = [];
  let temp = current; // Is this line really necessary?
  path.push(temp);
  while (temp.parent) {
    path.push(temp.parent);
    temp = temp.parent;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }

  if (waveActive) {
    if (keyIsPressed) {
      checkKeyIsDown()
      tileContainsPlayer = player.getTileContainsPlayer();
    }
  }

  // tileContainsPlayer.drawContainsPlayer();

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