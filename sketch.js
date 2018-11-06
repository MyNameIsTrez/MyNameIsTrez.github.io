// TO-DO LIST
// . upgrade buildings when lmbWindow is "GUI"
//   and you're hovering over a building. when pressing "e" on it you can upgrade it.
//   the building if you have enough of a resource
// . move resources to bottom/top of screen
// . buy 4x4 squares of land in all 4 directions
// . move the selected preview/button in the GUI by using WASD
//   so the game can be played on the arcade machine


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