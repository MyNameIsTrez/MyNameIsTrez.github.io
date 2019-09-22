class Tile {
  constructor(_col, _row, _wall) {
    this.col = _col;
    this.row = _row;
    this.x = _col * tileSize;
    this.y = _row * tileSize;
    this.wall = _wall;

    this.g = [];
    this.h = [];
    this.f = [];

    // Store the neighboring tiles at creation.
    this.neighbors = [];
    // Store the parent tile for every enemy.
    this.parents = [];
    // We only want one enemy or player to be able to stand on a single tile.
    this.entity = undefined;
  }

  show(color) {
    push();
    if (this.wall) {
      fill(0)
    } else {
      fill(color);
    }
    noStroke();
    // circle(this.x + tileSize / 2, this.y + tileSize / 2, tileSize / 2);
    if (fullWorldView) {
      square(this.x, this.y, tileSize);
    } else {
      const coords = getLimitedWorldViewCoordinates(this.x, this.y);
      square(coords.x, coords.y, tileSizeRD);
    }
    pop();
  }

  addNeighbors() {
    this.neighbors = [];

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

    if (diagonalNeighbors) {
      // Top-left.
      if (this.col > 0 && this.row > 0) {
        const neighborTop = world[this.col][this.row - 1];
        const neighborLeft = world[this.col - 1][this.row];
        // Prevents the path going diagonally through two walls.
        if (!(neighborTop.wall && neighborLeft.wall)) {
          this.neighbors.push(world[this.col - 1][this.row - 1]);
        }
      }
      // Top-right.
      if (this.col < cols - 1 && this.row > 0) {
        const neighborTop = world[this.col][this.row - 1];
        const neighborRight = world[this.col + 1][this.row];
        // Prevents the path going diagonally through two walls.
        if (!(neighborTop.wall && neighborRight.wall)) {
          this.neighbors.push(world[this.col + 1][this.row - 1]);
        }
      }
      // Bottom-left.
      if (this.col > 0 && this.row < rows - 1) {
        const neighborBottom = world[this.col][this.row + 1];
        const neighborLeft = world[this.col - 1][this.row];
        // Prevents the path going diagonally through two walls.
        if (!(neighborBottom.wall && neighborLeft.wall)) {
          this.neighbors.push(world[this.col - 1][this.row + 1]);
        }
      }
      // Bottom-right.
      if (this.col < cols - 1 && this.row < rows - 1) {
        const neighborBottom = world[this.col][this.row + 1];
        const neighborRight = world[this.col + 1][this.row];
        // Prevents the path going diagonally through two walls.
        if (!(neighborBottom.wall && neighborRight.wall)) {
          this.neighbors.push(world[this.col + 1][this.row + 1]);
        }
      }
    }
  }

  showContainsPlayer() {
    push();
    fill(0, 255, 255);
    noStroke();
    if (fullWorldView) {
      square(this.x, this.y, tileSize);
    } else {
      const coords = getLimitedWorldViewCoordinates(this.x, this.y);
      square(coords.x, coords.y, tileSizeRD);
    }
    pop();
  }
}