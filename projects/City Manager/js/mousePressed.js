function mousePressed() {
  interactedWithPage = true;
  switch (curWindow) {
    case 'game':
      clickCells();
      clickPreviews();
      clickButtonsGame();
      break;
    case 'upgrades':
      clickButtonsUpgrades();
      clickButtonsMisc();
      break;
    // case 'settings':
    //   clickButtonsSettings();
    //   clickButtonsMisc();
    //   break;
    default:
      clickButtonsMisc();
      break;
  }
}

function clickCells() {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 1; j < cells[i].length; j++) {
      cell = cells[i][j];
      cell.clicked();
    }
  }
}

function clickPreviews() {
  for (let i = 0; i < previews.game.length; i++) {
    preview = previews.game[i];
    preview.clicked();
  }
}

function clickButtonsGame() {
  for (let i = 0; i < buttons.game.length; i++) {
    button = buttons.game[i];
    button.clicked();
  }
}

function clickButtonsUpgrades() {
  for (let i = 0; i < buttons.upgrades.length; i++) {
    button = buttons.upgrades[i];
    button.clicked();
  }
}

// function clickButtonsSettings() {
//   for (let i = 0; i < buttons.settings.length; i++) {
//     button = buttons.settings[i];
//     button.clicked();
//   }
// }

function clickButtonsMisc() {
  for (let i = 0; i < buttons.misc.length; i++) {
    button = buttons.misc[i];
    button.clicked();
  }
}