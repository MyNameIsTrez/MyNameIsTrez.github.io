const cellsHorizontal = 40;
const cellsVertical = 20;
const cellWidthHeight = 20;
const width = cellsHorizontal * cellWidthHeight;
const height = cellsVertical * cellWidthHeight;
const cells = [];

let selectedID = 'wall';
let playing = true,
  debugging = true;

function setup() {
  createCanvas(width + 1, height + 1);
  for (let y = 0; y < cellsVertical; y++) {
    cells.push([]);
    for (let x = 0; x < cellsHorizontal; x++) {
      cells[y].push(new Cell(x, y, 'terrain'));
    }
  }
}

function draw() {
  for (const row of cells) {
    for (const cell of row) {
      cell.show();
    }
  }

  if (mouseIsPressed) {
    if (mouseY > 0 && mouseX > 0 && mouseY < height && mouseX < width) {
      var y = floor(mouseY / cellWidthHeight);
      var x = floor(mouseX / cellWidthHeight);
    }

    switch (mouseButton) {
      case LEFT:
        cells[y][x].id = selectedID;
        break;
      case RIGHT:
        cells[y][x].id = 'terrain';
        break;
    }
  }

  // Create enemies along the four edges
  if (playing) {
    if (random() < 0.01) {
      const NESW = floor(random(4));

      switch (NESW) {
        case 0: // North
        var y = 0;
        var x = floor(random(cellsHorizontal));
        break;
        case 1: // East
        var y = floor(random(cellsVertical));
        var x = cellsHorizontal - 1;
        break;
        case 2: // South
        var y = cellsVertical - 1;
        var x = floor(random(cellsHorizontal));
        break;
        case 3: // West
        var y = floor(random(cellsVertical));
        var x = 0;
        break;
      }

      cells[y][x].id = 'enemy';
      console.log(NESW, [y, x]);
    }
  }

  if (playing) {
    for (const row of cells) {
      for (const cell of row) {
        if (cell.id === 'enemy') {
          cell.enemyMove();
        }
      }
    }
  }

  if (debugging) {
    push();
    fill(255);

    let enemyCount = 0;
    for (row of cells) {
      for (cell of row) {
        if (cell.id === 'enemy') {
          enemyCount++;
        }
      }
    }
    text(`Playing: ${playing}`, 20, 30);
    text(`Enemies: ${enemyCount}`, 20, 60);

    pop();
  }
}

class Cell {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
  }

  show() {
    push();
    switch (this.id) {
      case 'wall':
        fill(255);
        break;
      case 'turret':
        fill(255, 255, 0);
        break;
      case 'terrain':
        fill(0);
        break;
      case 'enemy':
        fill(255, 0, 0);
        break;
    }
    rect(this.x * cellWidthHeight, this.y * cellWidthHeight, cellWidthHeight, cellWidthHeight);
    pop();
  }

  enemyMove() {

  }
}

function keyPressed() {
  switch (key) {
    case '1':
      selectedID = 'wall';
      break;
    case '2':
      selectedID = 'turret';
      break;
    case '3':
      break;
    case '4':
      break;
    case '5':
      break;
    case '6':
      break;
    case '7':
      break;
    case '8':
      break;
    case '9':
      break;
    case '0':
      break;

    case 'p': // Pause / Play
      playing = !playing;
      break;
    case 'd': // Debugging
      debugging = !debugging;
      break;
  }
}

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});