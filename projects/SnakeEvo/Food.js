class Food {
  constructor(index) {
    this.index = index;

    this.agentX = index % agentsHor;
    this.agentY = floor(index / agentsHor);

    this.pos = this.newPos();
  }

  draw() {
    push();
    noStroke();
    fill(255, 0, 0);
    const x = this.pos.x * scl + this.agentX * agentWidth;
    const y = this.pos.y * scl + this.agentY * agentHeight;
    square(x, y, scl);
    pop();
  }

  newPos() {
    // Guarantees food isn't placed where the snake is.
    const pxlsWithoutSnake = [];

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const parentSnake = snakes[this.index];
        if (parentSnake.pxls[x][y] === 0) {
          pxlsWithoutSnake.push({
            'x': x,
            'y': y
          });
        }
      }
    }

    const pos = random(pxlsWithoutSnake);
    return createVector(pos.x, pos.y);
  }

  setNewPos() {
    this.pos = this.newPos();
  }
}