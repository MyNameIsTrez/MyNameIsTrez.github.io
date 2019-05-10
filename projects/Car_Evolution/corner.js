class Corner {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.placed = false;
  }
  
  drawRadius() {
    circle(this.x, this.y, radius);
  }
}