// TODO:
//   . move resources to bottom/top of screen.
//   . buy 4x4 squares of land in all 4 directions.
//   . add sounds
//   . add scoring system
//   . add highscore list
//   . swap the arcade 'd' key with the 'a' key
//   . use a for loop to calc the resource usage and production in cells.js
//   . fix not being able to select buildings while lmbWindow === 'previews' or 'buttons' with the numbers
//   . building placement costs
//   . move the upgrades cost to be the first variable in the array
//   . add a button in the game window that removes all buildings when clicked & activated
//   . add a button for the research window
//   . add research


function setup() {
  frameRate(_frameRate);
  createGameCanvas();
  loadImages();

  createCells();
  getTotalCells();
  getExpansionCost();

  createPreviews();
  getActivePreviews();
  getPreviewRowsAndColumns();

  updateButtonBuyLand();
  createButtons();

  cursor = new Cursor();
}


function draw() {
  switch (curWindow) {
    case 'game':
      drawGame();
      break;
    case 'menu':
      drawMenu();
      break;
    case 'help':
      drawHelp();
      break;
    case 'upgrades':
      drawUpgrades();
      break;
    case 'stats':
      drawStats();
      break;
  }
}