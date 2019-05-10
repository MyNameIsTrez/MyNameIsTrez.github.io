class Corner {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.placed = false;
    this.checkpoint = false;
  }

  drawRadius() {
    push();
    if (!this.checkpoint) {
      fill(255, 63);
      circle(this.x, this.y, cornerRadius);
    } else {
      fill(0, 255, 0, 63);
      circle(this.x, this.y, cornerRadius);
    }
    pop();
  }

}