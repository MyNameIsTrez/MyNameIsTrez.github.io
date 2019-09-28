class Tile {
  constructor(_col, _row, _wall) {
    this.col = _col;
    this.row = _row;
    this.x = _col * tileSizeFull;
    this.y = _row * tileSizeFull;
    this.wall = _wall;
  }

  show(color) {
    push();
    if (this.wall) {
      fill(0)
    } else {
      fill(color);
    }

    noStroke();
    square(this.x, this.y, tileSizeFull);
    pop();
  }
}