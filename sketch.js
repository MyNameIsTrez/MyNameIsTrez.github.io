// TODO:
// > . upgrades
//   . only show the upgrades that are one upgrade level higher than your current building's upgrade level
//   . move resources to bottom/top of screen.
//   . buy 4x4 squares of land in all 4 directions.
//   . add sounds
//   . add scoring system
//   . add highscore list
//   . swap the arcade 'd' key with the 'a' key
//   . use a for loop to calc the resource usage and production in cells.js
//   . fix not being able to select buildings while lmbWindow === 'previews' or 'buttons'
//   . building placement costs

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