class Corner {
  
  constructor(x, y, placed, checkpoint) {
    this.x = x;
    this.y = y;
    this.placed = placed; // false by default
    this.checkpoint = checkpoint; // false by default
  }

  drawRadius() {
    push();
    if (!this.checkpoint)
      fill(255, 63);
    else
      fill(0, 255, 0, 63);
    circle(this.x, this.y, cornerRadius);
    pop();
  }

}