class Tile {
  constructor(_col, _row) {
    // this.col = _col;
    // this.row = _row;
    this.x = _col * tileSize;
    this.y = _row * tileSize;

    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  drawContainsPlayer() {
    push();
    fill(0, 0, 255);
    square(this.x, this.y, tileSize);
    pop();
  }
}