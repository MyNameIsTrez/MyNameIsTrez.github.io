class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  draw() {
    push();
    noFill();
    stroke(cursorColor);
    strokeWeight(2);
    rect(this.x, this.y, cellWidthHeight, cellWidthHeight);
    pop();
  }
}