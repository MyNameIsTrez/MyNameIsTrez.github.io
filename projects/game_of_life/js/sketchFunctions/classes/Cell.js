class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = 0;
    this.ticksDead = maxTicksColored + 1;
    this.neighbours = 0;
    this.rgb = [random(31, 223), random(31, 223), random(31, 223)];
  }

  draw() {
    push();

    if (this.alive) {
      fill(colors.black);
    } else {
      if (playing && this.ticksDead <= maxTicksColored) { // the longer the cell has been dead for, the lighter the color gets
        if (this.ticksDead === Infinity) {
          noFill();
        } else {
          this.rgb[3] = 256 - 256 / (maxTicksColored + 1) * this.ticksDead;
          if (convertColor() === "rainbow") {
            fill(this.rgb);
          } else {
            fill(convertColor().concat(this.rgb[3]));
          }
        }
      } else {
        noFill();
      }
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
        case 2: // remain
          if (!this.alive) {
            this.ticksDead++;
          }
          break;
        case 3: // born
          this.alive = 1;
          this.ticksDead = maxTicksColored + 1;
          break;
        case 6:
          if (gameMode === "high_life") { // born
            this.alive = 1;
            this.ticksDead = maxTicksColored + 1;
          } else { // dead
            if (this.alive) {
              this.ticksDead = 0;
            }
            this.alive = 0;
            this.ticksDead++;
          }
          break;
        default: // dead
          if (this.alive) {
            this.ticksDead = 0;
          }
          this.alive = 0;
          this.ticksDead++;
          break;
      }
    }
  }
  clicked() {}
}

function convertColor() {
  switch (coloredCellColor) {
    case "red":
      return [255, 0, 0];
    case "green":
      return [0, 255, 0];
    case "blue":
      return [0, 0, 255];
    case "rainbow":
      return "rainbow";
  }
}