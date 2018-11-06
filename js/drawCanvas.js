function drawGame() {
  createGameCanvas();

  // calculates whether the amount of seconds that pass
  // between every update have passed
  step++;
  if (step === fr * gameSpeed) {
    calcCells();
  } else {
    for (let i = 0; i < cells.length; i++) {
      for (let j = 1; j < cells[i].length; j++) {
        cell = cells[i][j];
        cell.drawCell();
        cell.drawBuilding();
      }
    }
  }

  for (let i = 0; i < previews.length; i++) {
    preview = previews[i];
    preview.draw();
  }

  for (let i = 0; i < buttons.length; i++) {
    button = buttons[i];
    button.draw();
  }

  drawGameTexts();
  player.draw();
}


function drawMenu() {
  createMenuCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text("menu screen", width / 2 - 80, height / 2);
  textSize(defaultTextSize);
}


function drawHelp() {
  createHelpCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text("help screen", width / 2 - 70, height / 2);
  textSize(defaultTextSize);
}


function drawUpgrades() {
  createUpgradesCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text("upgrades screen", width / 2 - 110, height / 2);
  textSize(defaultTextSize);
}


function drawStats() {
  createStatsCanvas()
  let millisOnline = millis();

  texts = [
    `Time spent: ${(Math.floor(millisOnline / 1000))} seconds`,
    `Number of cells: ${totalCells}`,
    `Size: ${cellWCount} x ${cellHCount}`
  ]

  fill(0);
  textSize(bigTextSize)
  noStroke();

  for (let j = 0; j < texts.length; j++) {
    text(texts[j], width / 2 - 160, height / 2 - 50 + j * 50);
  }
  textSize(defaultTextSize);
}