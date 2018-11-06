// TO-DO LIST
// . upgrades
// . move resources to bottom/top of screen
// . buy 4x4 squares of land in all 4 directions
//   by adding a second selector that can be moved with the keyboard


function setup() {
  frameRate(fr);
  createGameCanvas();
  loadImages();

  createCells();
  getTotalCells();
  getExpansionCost();

  createPreviews();

  updateButtonData();
  updateButtons();

  player = new Player();
}


function draw() {
  switch (curWindow) {
    default: drawGame();
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