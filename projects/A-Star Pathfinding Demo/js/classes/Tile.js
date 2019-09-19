class Tile {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.x = this.i * size;
    this.y = this.j * size;
  }

  drawContainsPlayer() {
    push();
    fill(0, 0, 255);
    square(this.i * size, this.j * size, size);
    pop();
  }
}