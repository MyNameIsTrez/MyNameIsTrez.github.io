const cellsHorizontal = 16;
const cellsVertical = 8;
const cellWidthHeight = 50;
const width = cellsHorizontal * cellWidthHeight;
const height = cellsVertical * cellWidthHeight;
const cells = [];
const enemySpawnRate = 0.01;

let selectedID = 'house';
let playing = false,
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

      switch (mouseButton) {
        case LEFT:
          cells[y][x].id = selectedID;
          break;
        case RIGHT:
          cells[y][x].id = 'terrain';
          break;
      }
    }
  }

  if (playing) {
    // Create enemies along the four edges
    if (random() < enemySpawnRate) {
      const NESW = floor(random(4));
      switch (NESW) {
        case 0: // North
          var x = floor(random(cellsHorizontal));
          var y = 0;
          break;
        case 1: // East
          var x = cellsHorizontal - 1;
          var y = floor(random(cellsVertical));
          break;
        case 2: // South
          var x = floor(random(cellsHorizontal));
          var y = cellsVertical - 1;
          break;
        case 3: // West
          var x = 0;
          var y = floor(random(cellsVertical));
          break;
      }
      cells[y][x].id = 'enemy';
    }

    // move the enemies
    if (frameCount % 150 === 0) {
      for (const row of cells) {
        for (const cell of row) {
          if (cell.id === 'enemy') {
            cell.enemyChooseTarget();
            cell.enemyMove();
          }
        }
      }
    }
  }

  if (debugging) {
    push();
    fill(255);

    let enemyCount = 0;
    let houseCount = 0;
    for (row of cells) {
      for (cell of row) {
        if (cell.id === 'enemy') {
          enemyCount++;
        } else if (cell.id === 'house') {
          houseCount++;
        }
      }
    }
    text(`Playing: ${playing}`, 20, 30);
    text(`Enemies: ${enemyCount}`, 20, 60);
    text(`Houses: ${houseCount}`, 20, 90);

    pop();
  }
}

class Cell {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.target;
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
      case 'house':
        fill(180, 110, 40);
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

  enemyChooseTarget() {
    let minDistance = Infinity;
    let minDistanceCell;
    for (const row of cells) {
      for (const cell of row) {
        if (cell.id === 'house') {
          const newDistance = dist(this.x, this.y, cell.x, cell.y);
          if (minDistance === Infinity || newDistance < minDistance) {
            minDistance = newDistance;
            minDistanceCell = cell;
          }
        }
      }
    }
    this.closestTarget = minDistanceCell;
  }

  enemyMove() {
    // get the x and y difference
    const xDiff = this.closestTarget.x - this.x;
    const yDiff = this.closestTarget.y - this.y;

    // moving direction based on if the x and y diff are pos or neg
    if (xDiff < 0) {
      cells[this.y][this.x - 1].id = 'enemy';
    } else if (xDiff > 0) {
      cells[this.y][this.x + 1].id = 'enemy';
    } else if (yDiff < 0) {
      cells[this.y - 1][this.x].id = 'enemy';
    } else if (yDiff > 0) {
      cells[this.y + 1][this.x].id = 'enemy';
    }
    cells[this.y][this.x].id = 'terrain';
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
      selectedID = 'house';
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