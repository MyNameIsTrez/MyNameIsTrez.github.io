class Tile {
  constructor(_col, _row) {
    this.col = _col;
    this.row = _row;
    this.x = _col * tileSize;
    this.y = _row * tileSize;

    this.type = 'empty';
  }

  show() {
    push();
    switch (this.type) {
      case 'wall':
        fill(0)
        break;
      case 'player':
        fill(0, 255, 255);
        break;
      case 'enemy spawnpoint':
        fill(255, 255, 0);
        break;
    }

    noStroke();
    square(this.x, this.y, tileSize);
    pop();
  }
}