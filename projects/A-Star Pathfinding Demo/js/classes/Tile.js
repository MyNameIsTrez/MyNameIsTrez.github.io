class Tile {
  constructor(_col, _row, _wall) {
    this.col = _col;
    this.row = _row;
    this.x = _col * tileSize;
    this.y = _row * tileSize;

    this.wall = _wall;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = [];
    this.parent = undefined;
  }

  show(color) {
    push();
    if (this.wall) {
      fill(0)
    } else {
      fill(color);
    }
    noStroke();
    square(this.x, this.y, tileSize);
    pop();
  }

  addNeighbors() {
    // Right.
    if (this.col < cols - 1) {
      this.neighbors.push(world[this.col + 1][this.row]);
    }
    // Left.
    if (this.col > 0) {
      this.neighbors.push(world[this.col - 1][this.row]);
    }
    // Bottom.
    if (this.row < rows - 1) {
      this.neighbors.push(world[this.col][this.row + 1]);
    }
    // Top.
    if (this.row > 0) {
      this.neighbors.push(world[this.col][this.row - 1]);
    }

    // // Top-left.
    // if (this.col > 0 && this.row > 0) {
    //   this.neighbors.push(world[this.col - 1][this.row - 1]);
    // }
    // // Top-right.
    // if (this.col < cols - 1 && this.row > 0) {
    //   this.neighbors.push(world[this.col + 1][this.row - 1]);
    // }
    // // Bottom-left.
    // if (this.col > 0 && this.row < rows - 1) {
    //   this.neighbors.push(world[this.col - 1][this.row + 1]);
    // }
    // // Bottom-right.
    // if (this.col < cols - 1 && this.row < rows - 1) {
    //   this.neighbors.push(world[this.col + 1][this.row + 1]);
    // }
  }

  drawContainsPlayer() {
    push();
    fill(0, 255, 255);
    noStroke();
    square(this.x, this.y, tileSize);
    pop();
  }
}