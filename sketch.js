// TODO:
//   . move resources to bottom/top of screen.
//   . buy 4x4 squares of land in all 4 directions.
//   . add scoring system
//   . add highscore list
//   . swap the arcade 'd' key with the 'a' key
//   . use a for loop to calc the resource usage and production in cells.js
//   . building placement costs
//   . add a button for the research window
//   . add research
//   . fix that when you click the lower half of the buy land button, it also clicks the stats button
//   . prevent placing a building on a cell that already contains that building (to fix sound annoyances)
//   . show the building multiplier info in the stats screen
//   . draw a border around the previews area
//   . draw a border around the resources area
//   . think of a new way of highlighting selected buttons
//   . make glorious_morning_2 less loud by using JS
//   . make a music and sound volume slider
//   . make a settings button and move the stats button into it


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
  playTheme();
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
  checkIfThemeEnded();
}