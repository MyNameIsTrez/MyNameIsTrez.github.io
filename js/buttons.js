class Button {
  constructor(type, drawText, letterWidth, x, y, w, h) {
    this.type = type;
    this.drawText = drawText;
    this.letterWidth = letterWidth;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    switch (curWindow) {
      case "game":
        if (selectedButton === this.type) {
          stroke(0);
        } else {
          noStroke();
        }

        // bg color
        fill(buttonClr);
        rect(this.x, height - this.y, this.w, this.h);

        noStroke();
        fill(0);
        text(
          this.drawText,
          this.x + ((this.w / 2) - ((this.drawText.length * this.letterWidth) / 2)),
          height - this.y + (this.h / 1.5)
        );
        break;
      case "upgrades":
        if (selectedButton === this.type) {
          stroke(0);
        } else {
          noStroke();
        }

        fill(buttonClr); // bg color
        rect(this.x, this.y, this.w, this.h);

        textSize(bigTextSize);
        noStroke();
        fill(0);
        text(
          this.drawText,
          this.x + ((this.w / 4) - ((this.drawText.length * this.letterWidth) / 4)),
          this.y + (this.h / 1.5)
        );
        break;
    }
  }

  clicked() {
    switch (curWindow) {
      case "game":
        if (
          (mouseX > this.x) &&
          (mouseX < this.x + this.w) &&
          (mouseY > height - this.y) &&
          (mouseY < height - this.y + this.h)
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
        break;
      case "upgrades":
        if (
          (mouseX > this.x) &&
          (mouseX < this.x + this.w) &&
          (mouseY > this.y) &&
          (mouseY < this.y + this.h)
        ) {
          switch (this.type) {
            case "farm":
              console.log("test1");
              break;
            case "house":
              console.log("test2");
              break;
            case "office":
              console.log("test3");
              break;
            case "laboratory":
              console.log("test4");
              break;
            case "windmill":
              console.log("test5");
              break;
            case "uranium mine":
              console.log("test6");
              break;
            case "reactor":
              console.log("test7");
              break;
          }
        }
        break;
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