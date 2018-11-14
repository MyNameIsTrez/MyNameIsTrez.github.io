class Button {
  constructor(type, drawText, wordWidth, x, y, w, h) {
    this.type = type;
    this.drawText = drawText;
    this.wordWidth = wordWidth;
    this.x = x;
    this.y = height - y;
    this.w = w;
    this.h = h;
  }

  draw() {
    if (selectedButton === this.type) {
      stroke(0);
    } else {
      noStroke();
    }

    fill(buttonClr); // bg color
    rect(this.x, this.y, this.w, this.h);

    noStroke();
    fill(0);
    text(
      this.drawText,
      this.x + ((this.w / 2) - ((this.drawText.length * this.wordWidth) / 2)),
      this.y + (this.h / 1.5)
    );
  }


  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + this.w)) &&
      (mouseY > this.y) &&
      (mouseY < ((height - this.y) + this.h))
    ) {
      switch (this.type) {
        case "buy land":
          buyLand();
          break;
        case "menu":
          curWindow = "menu"
          break;
        case "help":
          curWindow = "help"
          break;
        case "upgrades":
          curWindow = "upgrades"
          break;
        case "stats":
          curWindow = "stats"
          break;
      }
    }
  }
}

function updateButtonData() {
  buttonData[2 * buttonDataBlock + 1] = `Buy Land: $${expansionCost}`;
}

function updateButtons() {
  buttons = [];
  for (let i = 0; i < buttonData.length / buttonDataBlock; i++) {
    button = new Button(
      buttonData[i * buttonDataBlock],
      buttonData[1 + i * buttonDataBlock],
      buttonData[2 + i * buttonDataBlock],
      buttonData[3 + i * buttonDataBlock],
      buttonData[4 + i * buttonDataBlock],
      buttonData[5 + i * buttonDataBlock],
      buttonData[6 + i * buttonDataBlock]
    );

    buttons[i] = button;
  }
}