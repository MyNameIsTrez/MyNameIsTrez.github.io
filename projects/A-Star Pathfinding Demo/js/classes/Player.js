class Player {
  constructor(_col, _row) {
    this.x = _col * tileSize + 0.5 * tileSize;
    this.y = _row * tileSize + 0.5 * tileSize;
    this.radius = tileSize / 2;
    this.speed = 2; // The amount of pixels moved per frame of a key being held. Rounded up by a for loop.
  }

  show() {
    push();
    fill(0, 255, 0);
    circle(this.x, this.y, this.radius);
    pop();
  }

  getTileContainsPlayer() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const tile = world[i][j];
        tile.containsPlayer = false;
      }
    }
    const i = floor(this.x / tileSize);
    const j = floor(this.y / tileSize);
    return world[i][j];
    // const tile = world[i][j];
    // tile.containsPlayer = true;
  }
}