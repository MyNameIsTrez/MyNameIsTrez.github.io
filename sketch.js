// TO-DO LIST
// . upgrades
// . move resources to bottom/top of screen.
// . buy 4x4 squares of land in all 4 directions.
// . add sounds
// . add scoring system
// . add highscore list
// . swap the arcade "d" key with the "a" key
// . have the yellow cursor on the selected building and
//   the selected button
// . building costs
// . in preview.js line 11, find a way to replace "0, 255, 0" with selectedColor

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