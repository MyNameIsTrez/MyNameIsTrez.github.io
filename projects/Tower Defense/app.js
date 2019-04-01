const cellsHorizontal = 40;
const cellsVertical = 20;
const cellWidthHeight = 20;
const width = cellsHorizontal * cellWidthHeight;
const height = cellsVertical * cellWidthHeight;
const cells = [];

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
      case 'terrain':
        fill(0);
        break;
      case 'wall':
        fill(255);
        break;
    }
    rect(this.x * cellWidthHeight, this.y * cellWidthHeight, cellWidthHeight, cellWidthHeight);
    pop();
  }
}

function mousePressed() {
  switch (mouseButton) {
    case LEFT:
      if (mouseY > 0 && mouseX > 0 && mouseY < height && mouseX < width) {
        const y = floor(mouseY / cellWidthHeight);
        const x = floor(mouseX / cellWidthHeight);
        cells[y][x].id = selectedID;
      }
      break;
  }
}