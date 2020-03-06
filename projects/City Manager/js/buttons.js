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
        // bg color
        stroke(0);
        fill(buttonClr);
        rect(this.x, height - this.y, this.w, this.h);

        // text
        textSize(this.letterW * 2);
        noStroke();
        fill(0);
        text(
          this.drawText,
          this.x + ((this.w / 2) - ((this.drawText.length * this.letterW) / 2)),
          height - this.y + (this.h / 1.5)
        );
        break;
      case 'upgrades':
        if (this.building === 'back') {
          // bg color
          stroke(0);
          fill(buttonClr);
          rect(this.x, this.y, this.w, this.h);

          // text
          textSize(this.letterW * 2);
          noStroke();
          fill(0);
          text(
            this.drawText,
            this.x + ((this.w / 2) - ((this.drawText.length * this.letterW) / 2)),
            this.y + (this.h / 1.5)
          );
        } else {
          // if farm_upgrade_level === this.building (farm_3 -> 3 - 1 = 2), show
          if (
            window[this.building.substr(0, this.building.length - 1) + 'upgrade_level']
            ===
            this.building.charAt(this.building.length - 1) - 1
          ) {
            this.active = true;

            // bg color
            stroke(0);
            fill(buttonClr);
            rect(this.x, this.y, this.w, this.h);

            // text
            textSize(this.letterW * 2);
            noStroke();
            fill(0);
            text(
              this.drawText,
              this.x + ((this.w / 4) - ((this.drawText.length * this.letterW) / 4)),
              this.y + (this.h / 1.5)
            );
          }
        }
        break;
      // case 'settings':
      // if (this.building === 'back') {
      // 	// bg color
      // 	stroke(0);
      // 	fill(buttonClr);
      // 	rect(this.x, this.y, this.w, this.h);

      // 	// text
      // 	textSize(this.letterW * 2);
      // 	noStroke();
      // 	fill(0);
      // 	text(
      // 		this.drawText,
      // 		this.x + ((this.w / 2) - ((this.drawText.length * this.letterW) / 2)),
      // 		this.y + (this.h / 1.5)
      // 	);
      // } else if (this.building === 'stats') {
      // 	// bg color
      // 	stroke(0);
      // 	fill(buttonClr);
      // 	rect(this.x, this.y, this.w, this.h);

      // 	// text
      // 	textSize(this.letterW * 2);
      // 	noStroke();
      // 	fill(0);
      // 	text(
      // 		this.drawText,
      // 		this.x + ((this.w / 4) - ((this.drawText.length * this.letterW) / 4)),
      // 		this.y + (this.h / 1.5)
      // 	);
      // }
      // break;
      default:
        // bg color
        stroke(0);
        fill(buttonClr);
        rect(this.x, this.y, this.w, this.h);

        // text
        textSize(this.letterW * 2);
        noStroke();
        fill(0);
        text(
          this.drawText,
          this.x + ((this.w / 2) - ((this.drawText.length * this.letterW) / 2)),
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
            case 'remove_buildings':
              playSoundRemoveBuildings();
              removeBuildings();
              break;
            // case 'settings':
            // playSoundGUI();
            // lastWindow = curWindow;
            // curWindow = 'settings'
            // break;
            case 'upgrades':
              playSoundGUI();
              lastWindow = curWindow;
              curWindow = 'upgrades'
              break;
            case 'buy_land':
              playSoundGUI();
              buyLand();
              break;
            case 'menu':
              playSoundGUI();
              lastWindow = curWindow;
              curWindow = 'menu'
              break;
            case 'help':
              playSoundGUI();
              lastWindow = curWindow;
              curWindow = 'help'
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
          if (this.building === 'back') {
            playSoundGUI();
            curWindow = lastWindow;
          } else {
            if (this.active) {
              selectedButton.upgrades = this.building;
              buyUpgrade();
            }
          }
        }
        break;
      // case 'settings':
      // if (
      //   (mouseX > this.x) &&
      //   (mouseX < this.x + this.w) &&
      //   (mouseY > this.y) &&
      //   (mouseY < this.y + this.h)
      // ) {
      //   if (this.building === 'back') {
      //     playSoundGUI();
      //     curWindow = lastWindow;
      //   } else {
      //     if (this.building === 'stats') {
      //       playSoundGUI();
      //       lastWindow = 'settings';
      //       curWindow = 'stats';
      //     }
      //   }
      // }
      // break;
      default:
        if (
          (mouseX > this.x) &&
          (mouseX < this.x + this.w) &&
          (mouseY > this.y) &&
          (mouseY < this.y + this.h)
        ) {
          if (this.building === 'back') {
            playSoundGUI();
            curWindow = lastWindow;
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
  // name, drawText, pxWPerLetter, x, y, w, h

  // the game buttons
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

  // the upgrade buttons
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

  // the settings buttons
  // for (let i = 0; i < buttonData.settings.length / buttonDataBlock; i++) {
  //   button = new Button(
  //     buttonData.settings[i * buttonDataBlock],
  //     buttonData.settings[1 + i * buttonDataBlock],
  //     buttonData.settings[2 + i * buttonDataBlock],
  //     buttonData.settings[3 + i * buttonDataBlock],
  //     buttonData.settings[4 + i * buttonDataBlock],
  //     buttonData.settings[5 + i * buttonDataBlock],
  //     buttonData.settings[6 + i * buttonDataBlock]
  //   );
  //   buttons.settings.push(button);
  // }

  // the miscellaneous buttons
  for (let i = 0; i < buttonData.misc.length / buttonDataBlock; i++) {
    button = new Button(
      buttonData.misc[i * buttonDataBlock],
      buttonData.misc[1 + i * buttonDataBlock],
      buttonData.misc[2 + i * buttonDataBlock],
      buttonData.misc[3 + i * buttonDataBlock],
      buttonData.misc[4 + i * buttonDataBlock],
      buttonData.misc[5 + i * buttonDataBlock],
      buttonData.misc[6 + i * buttonDataBlock]
    );
    buttons.misc.push(button);
  }
}