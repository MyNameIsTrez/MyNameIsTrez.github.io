class Enemy {
  constructor(i, j) {
    this.x = i * size + 0.5 * size;
    this.y = i * size + 0.5 * size;
    this.radius = size / 2;
    this.speed = 1;
  }

  draw() {
    push();
    fill(255, 0, 0);
    circle(this.x, this.y, this.radius);
    pop();
  }
}