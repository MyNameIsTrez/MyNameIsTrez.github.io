class Player {
  constructor() {
    this.x = GUIWidth;
    this.y = 0;
  }

  draw() {
    fill(255, 255, 63)
    stroke(0);
    rect(
      this.x + cellWH / playerSize,
      this.y + cellWH / playerSize,
      cellWH - 2 * cellWH / playerSize,
      cellWH - 2 * cellWH / playerSize
    );
  }
}