class Player {
  constructor() {
    this.gameX = GUIWidth;
    this.gameY = 0;
    this.GUIX = 0;
    this.GUIY = 0;
  }

  draw() {
    if (lmbWindow === "game") {
      fill(255, 255, 63);
      stroke(0);
      rect(
        this.gameX + cellWH / playerSize,
        this.gameY + cellWH / playerSize,
        cellWH - 2 * cellWH / playerSize,
        cellWH - 2 * cellWH / playerSize
      );
    }
  }
}