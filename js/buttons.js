class Button {
  constructor(building, drawText, letterW, x, y, w, h) {
    this.building = building;
    this.drawText = drawText;
    this.letterW = letterW;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    switch (curWindow) {
      case 'game':
        // if the selectedButton is this button, draw a black rectangle around it
        if (selectedButton.game === this.building) {
          stroke(0);
        } else {
          noStroke();
        }

        // bg color
        fill(buttonClr);
        rect(this.x, height - this.y, this.w, this.h);

        // text
        noStroke();
        fill(0);
        text(
          this.drawText,
          this.x + ((this.w / 2) - ((this.drawText.length * this.letterW) / 2)),
          height - this.y + (this.h / 1.5)
        );
        break;
      case 'upgrades':
        // if the selectedButton is this button, draw a black rectangle around it
        if (selectedButton.upgrades === this.building) {
          stroke(0);
        } else {
          noStroke();
        }

        // bg color
        fill(buttonClr);
        rect(this.x, this.y, this.w, this.h);

        // text
        textSize(bigTextSize);
        noStroke();
        fill(0);
        text(
          this.drawText,
          this.x + ((this.w / 4) - ((this.drawText.length * this.letterW) / 4)),
          this.y + (this.h / 1.5)
        );
        break;
    }
  }

  clicked() {
    switch (curWindow) {
      case 'game':
        if (
          (mouseX > this.x) &&
          (mouseX < this.x + this.w) &&
          (mouseY > height - this.y) &&
          (mouseY < height - this.y + this.h)
        ) {
          switch (this.building) {
            case 'buy_land':
              buyLand();
              break;
            case 'menu':
              curWindow = 'menu'
              break;
            case 'help':
              curWindow = 'help'
              break;
            case 'upgrades':
              curWindow = 'upgrades'
              break;
            case 'stats':
              curWindow = 'stats'
              break;
          }
        }
        break;
      case 'upgrades':
        if (
          (mouseX > this.x) &&
          (mouseX < this.x + this.w) &&
          (mouseY > this.y) &&
          (mouseY < this.y + this.h)
        ) {
          switch (this.building) {
            case 'farm':
              console.log('test1');
              break;
            case 'house':
              console.log('test2');
              break;
            case 'office':
              console.log('test3');
              break;
            case 'laboratory':
              console.log('test4');
              break;
            case 'windmill':
              console.log('test5');
              break;
            case 'uranium_mine':
              console.log('test6');
              break;
            case 'reactor':
              console.log('test7');
              break;
          }
        }
        break;
    }
  }
}

function updateButtonBuyLand() {
  buttonData.game[2 * buttonDataBlock + 1] = `Buy Land: $${expansionCost}`;
}

function createButtons() {
  buttons = { game: [], upgrades: [] };
  // name, drawText, pxWPerLetter, x, y, w, h

  // for the game buttons
  for (let i = 0; i < buttonData.game.length / buttonDataBlock; i++) {
    button = new Button(
      buttonData.game[i * buttonDataBlock],
      buttonData.game[1 + i * buttonDataBlock],
      buttonData.game[2 + i * buttonDataBlock],
      buttonData.game[3 + i * buttonDataBlock],
      buttonData.game[4 + i * buttonDataBlock],
      buttonData.game[5 + i * buttonDataBlock],
      buttonData.game[6 + i * buttonDataBlock]
    );
    buttons.game.push(button);
  }

  // for the upgrade buttons
  for (let i = 0; i < buttonData.upgrades.length / buttonDataBlock; i++) {
    button = new Button(
      buttonData.upgrades[i * buttonDataBlock],
      buttonData.upgrades[1 + i * buttonDataBlock],
      buttonData.upgrades[2 + i * buttonDataBlock],
      buttonData.upgrades[3 + i * buttonDataBlock],
      buttonData.upgrades[4 + i * buttonDataBlock],
      buttonData.upgrades[5 + i * buttonDataBlock],
      buttonData.upgrades[6 + i * buttonDataBlock]
    );
    buttons.upgrades.push(button);
  }
}