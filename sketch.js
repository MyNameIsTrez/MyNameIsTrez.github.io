// TO-DO LIST
// . when you press "q" a third time lmbWindow = "buttons" and you can select buttons.
//   you switch back to "game" when you press "q" a fourth time.
// . when lmbWindow is "buttons" and you clicked "e" on the "Upgrade" button
//   you can purchase upgrades that are updated in the "buildings" object.
// . move resources to bottom/top of screen.
// . buy 4x4 squares of land in all 4 directions.
// . move the selected preview/button in the GUI by using WASD
//   so the game can be played on the arcade machine.
// . add sounds
// . add scoring system
// . add highscore list


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