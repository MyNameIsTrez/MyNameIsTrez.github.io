class Button {

  constructor(text, x, y, width, height) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    push();
    fill(255);
    rect(this.x, this.y, this.width, this.height);
    fill(0);
    // textSize();
    text(this.text, this.x, this.y);
    pop();
  }

}