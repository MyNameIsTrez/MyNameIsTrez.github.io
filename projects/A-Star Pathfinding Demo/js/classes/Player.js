class Player {
  constructor(_col, _row) {
    this.col = _col;
    this.row = _row;
    this.x = _col * tileSize + 0.5 * tileSize;
    this.y = _row * tileSize + 0.5 * tileSize;
    this.radius = tileSize / 2;
    this.speed = 2; // The amount of pixels moved per frame of a key being held. Rounded up by a for loop.

    // The current tile the enemy is standing on.
    this.current = world[_col][_row];
    this.current.wall = false;
    this.current.entity = this;
  }

  show() {
    push();
    fill(0, 255, 255);
    strokeWeight(0.5);
    circle(this.x, this.y, this.radius);
    pop();
  }

  getTileContainsPlayer() {
    const col = floor(this.x / tileSize);
    const row = floor(this.y / tileSize);
    return world[col][row];
  }
}