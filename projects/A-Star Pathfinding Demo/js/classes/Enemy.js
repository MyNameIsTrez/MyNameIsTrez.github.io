class Enemy {
  constructor(_col, _row) {
    this.x = _col * tileSize + 0.5 * tileSize;
    this.y = _row * tileSize + 0.5 * tileSize;
    this.radius = tileSize / 2;
    this.speed = 1;
  }

  show() {
    push();
    fill(255, 255, 0);
    strokeWeight(0.5);
    circle(this.x, this.y, this.radius);
    pop();
  }
}