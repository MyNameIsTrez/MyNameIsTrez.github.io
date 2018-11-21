// TO-DO LIST
//   . upgrades
//   . move resources to bottom/top of screen.
//   . buy 4x4 squares of land in all 4 directions.
//   . add sounds
//   . add scoring system
//   . add highscore list
//   . add win condition by fastest time
//   . swap the arcade "d" key with the "a" key
//   . use a for loop to calc the resource usage and production in cell.js (testing commented out)
//   . fix the cursor in the preview mode
// > . move the 'upgrades' button code in the normal button code

function setup() {
  frameRate(fr);
  createGameCanvas();
  loadImages();

  createCells();
  getTotalCells();
  getExpansionCost();

  createPreviews();
  getActivePreviews();
  getPreviewRowsAndColumns();

  updateButtonData();
  updateButtons();

  cursor = new Cursor();
}


function draw() {
  // console.log(buildings["farm"][2][0])
  switch (curWindow) {
    case "game":
      drawGame();
      break;
    case "menu":
      drawMenu();
      break;
    case "help":
      drawHelp();
      break;
    case "upgrades":
      drawUpgrades();
      break;
    case "stats":
      drawStats();
      break;
  }
}