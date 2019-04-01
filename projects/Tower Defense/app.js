const cellsHorizontal = 40;
const cellsVertical = 20;
const cellWidthHeight = 20;
let cells = [];

function setup() {
  background(0);
  stroke(255);
  for (let y = 0; y < cellsVertical; y++) {
    for (let x = 0; x < cellsHorizontal; x++) {
      cells[y][x] = new Cell(x, y);
      cells[y][x].show();
    }
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    rect(this.x, this.y, cellWidthHeight, cellWidthHeight);
  }
}