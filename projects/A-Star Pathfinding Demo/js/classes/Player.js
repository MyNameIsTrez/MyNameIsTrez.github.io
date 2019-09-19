class Player {
  constructor(i, j) {
    this.x = i * size + 0.5 * size;
    this.y = j * size + 0.5 * size;
    this.radius = size / 2;
    this.speed = 2; // The amount of pixels moved per frame of a key being held. Rounded up by a for loop.
  }

  draw() {
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
    const i = floor(this.x / size);
    const j = floor(this.y / size);
    return world[i][j];
    // const tile = world[i][j];
    // tile.containsPlayer = true;
  }
}