class Button {
  constructor(building, drawText, letterW, x, y, w, h) {
    this.building = building;
    this.drawText = drawText;
    this.letterW = letterW;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.active = false;
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
        // if farm_upgrade_level === this.building (farm_3 -> 3 - 1 = 2), show
        if (
          window[this.building.substr(0, this.building.length - 1) + 'upgrade_level']
          ===
          this.building.charAt(this.building.length - 1) - 1
        ) {
          this.active = true;

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
        }
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
            case 'remove_buildings':
              playSoundRemoveBuildings();
              removeBuildings();
              break;
            case 'stats':
              curWindow = 'stats'
              break;
            case 'upgrades':
              curWindow = 'upgrades'
              break;
            case 'buy_land':
              buyLand();
              break;
            case 'menu':
              curWindow = 'menu'
              break;
            case 'help':
              curWindow = 'help'
              break;
          }
        }
        break;
      case 'upgrades':
        if (this.active) {
          if (
            (mouseX > this.x) &&
            (mouseX < this.x + this.w) &&
            (mouseY > this.y) &&
            (mouseY < this.y + this.h)
          ) {
            switch (this.building) {
              case 'farm_1':
                buyUpgrade('farm_1');
                break;
              case 'house_1':
                buyUpgrade('house_1');
                break;
              case 'office_1':
                buyUpgrade('office_1');
                break;
              case 'laboratory_1':
                buyUpgrade('laboratory_1');
                break;
              case 'windmill_1':
                buyUpgrade('windmill_1');
                break;
              case 'uranium_mine_1':
                buyUpgrade('uranium_mine_1');
                break;
              case 'reactor_1':
                buyUpgrade('reactor_1');
                break;

              case 'farm_2':
                buyUpgrade('farm_2');
                break;
              case 'house_2':
                buyUpgrade('house_2');
                break;
              case 'office_2':
                buyUpgrade('office_2');
                break;
              case 'laboratory_2':
                buyUpgrade('laboratory_2');
                break;
              case 'windmill_2':
                buyUpgrade('windmill_2');
                break;
              case 'uranium_mine_2':
                buyUpgrade('uranium_mine_2');
                break;
              case 'reactor_2':
                buyUpgrade('reactor_2');
                break;

              case 'farm_3':
                buyUpgrade('farm_3');
                break;
              case 'house_3':
                buyUpgrade('house_3');
                break;
              case 'office_3':
                buyUpgrade('office_3');
                break;
              case 'laboratory_3':
                buyUpgrade('laboratory_3');
                break;
              case 'windmill_3':
                buyUpgrade('windmill_3');
                break;
              case 'uranium_mine_3':
                buyUpgrade('uranium_mine_3');
                break;
              case 'reactor_3':
                buyUpgrade('reactor_3');
                break;
            }
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