class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = 0;
    this.neighbours = 0;
  }

  draw() {
    push();
    if (this.alive) {
      fill(0);
    } else {
      noFill();
    }
    noStroke();

    rect(this.x * cellWidthHeight, this.y * cellWidthHeight, cellWidthHeight, cellWidthHeight);
    pop();
  }

  getNeighbours() {
    if (playing) {
      let offsetX = 0;
      let offsetY = 0;
      this.neighbours = 0;
      // check for the surrounding neighbours
      if (loopEdges) {
        // top-left
        offsetX = 0;
        offsetY = 0;
        if (this.y === 0) {
          offsetY = cellHeightCount;
        }
        if (this.x === 0) {
          offsetX = cellWidthCount;
        }
        this.neighbours += cells[this.y - 1 + offsetY][this.x - 1 + offsetX].alive;


        // top
        offsetY = 0;
        if (this.y === 0) {
          offsetY = cellHeightCount;
        }
        this.neighbours += cells[this.y - 1 + offsetY][this.x].alive;


        // top-right
        offsetX = 0;
        offsetY = 0;
        if (this.y === 0) {
          offsetY = cellHeightCount;
        }
        if (this.x === cellWidthCount - 1) {
          offsetX = -cellWidthCount;
        }
        this.neighbours += cells[this.y - 1 + offsetY][this.x + 1 + offsetX].alive;


        // left
        offsetX = 0;
        if (this.x === 0) {
          offsetX = cellWidthCount;
        }
        this.neighbours += cells[this.y][this.x - 1 + offsetX].alive;


        // right
        offsetX = 0;
        if (this.x === cellWidthCount - 1) {
          offsetX = -cellWidthCount;
        }
        this.neighbours += cells[this.y][this.x + 1 + offsetX].alive;


        // bottom-left
        offsetX = 0;
        offsetY = 0;
        if (this.y === cellHeightCount - 1) {
          offsetY = -cellHeightCount;
        }
        if (this.x === 0) {
          offsetX = cellWidthCount;
        }
        this.neighbours += cells[this.y + 1 + offsetY][this.x - 1 + offsetX].alive;


        // bottom
        offsetY = 0;
        if (this.y === cellHeightCount - 1) {
          offsetY = -cellHeightCount;
        }
        this.neighbours += cells[this.y + 1 + offsetY][this.x].alive;


        // bottom-right
        offsetX = 0;
        offsetY = 0;
        if (this.y === cellHeightCount - 1) {
          offsetY = -cellHeightCount;
        }
        if (this.x === cellWidthCount - 1) {
          offsetX = -cellWidthCount;
        }
        this.neighbours += cells[this.y + 1 + offsetY][this.x + 1 + offsetX].alive;


      } else {


        // top-left
        if (this.y > 0 && this.x > 0) {
          this.neighbours += cells[this.y - 1][this.x - 1].alive;
        }
        // top
        if (this.y > 0) {
          this.neighbours += cells[this.y - 1][this.x].alive;
        }
        // top-right
        if (this.y > 0 && this.x < cellWidthCount - 1) {
          this.neighbours += cells[this.y - 1][this.x + 1].alive;
        }

        // left
        if (this.x > 0) {
          this.neighbours += cells[this.y][this.x - 1].alive;
        }
        // right
        if (this.x < cellWidthCount - 1) {
          this.neighbours += cells[this.y][this.x + 1].alive;
        }

        // bottom-left
        if (this.y < cellHeightCount - 1 && this.x > 0) {
          this.neighbours += cells[this.y + 1][this.x - 1].alive;
        }
        // bottom
        if (this.y < cellHeightCount - 1) {
          this.neighbours += cells[this.y + 1][this.x].alive;
        }
        // bottom-right
        if (this.y < cellHeightCount - 1 && this.x < cellWidthCount - 1) {
          this.neighbours += cells[this.y + 1][this.x + 1].alive;
        }
      }
    }
  }

  calculate() {
    if (playing) {
      switch (this.neighbours) {
        case 2:
          break;
        case 3:
          if (!this.alive) {
            this.alive = 1;
          }
          break;
        case 6:
          if (gameMode === `high_life`) {
            if (!this.alive) {
              this.alive = 1;
            }
          } else {
            this.alive = 0;
          }
          break;
        default:
          this.alive = 0;
          break;
      }
    }
  }
  clicked() { }
}