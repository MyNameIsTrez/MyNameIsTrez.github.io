class Upgrade {
  constructor(type, drawText, x, y, w, h) {
    this.type = type;
    this.drawText = drawText;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    push();
    noStroke();
    fill(buttonClr); // bg color
    rect(this.x, this.y, this.w, this.h);

    textSize(bigTextSize);
    noStroke();
    fill(0);
    text(
      this.drawText,
      this.x + ((this.w / 2) - ((this.drawText.length * pxWidthPerBigWord) / 2)),
      this.y + (this.h / 1.5)
    );
    pop();
  }

  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + this.w)) &&
      (mouseY > this.y) &&
      (mouseY < (this.y + this.h))
    ) {
      switch (this.type) {
        case "farm":
          console.log("farm");
          break;
        case "house":

          break;
        case "office":

          break;
        case "laboratory":

          break;
        case "windmill":

          break;
        case "uranium mine":

          break;
        case "reactor":

          break;
      }
    }
  }
}


function updateUpgrades() {
  upgradeArray = [];
  for (let i = 0; i < upgradeData.length / upgradeDataBlock; i++) {
    upgrade = new Upgrade(
      upgradeData[i * upgradeDataBlock],
      upgradeData[1 + i * upgradeDataBlock],
      upgradeData[2 + i * upgradeDataBlock],
      upgradeData[3 + i * upgradeDataBlock],
      upgradeData[4 + i * upgradeDataBlock],
      upgradeData[5 + i * upgradeDataBlock]
    );

    upgradeArray[i] = upgrade;
  }
}