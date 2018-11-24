function drawGame() {
  createGameCanvas();

  // calculates whether the amount of seconds that pass
  // between every update have passed
  step++;
  if (step === _frameRate * gameSpeed) {
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

  for (let i = 0; i < previews.game.length; i++) {
    preview = previews.game[i];
    preview.draw();
  }

  for (let i = 0; i < buttons.game.length; i++) {
    button = buttons.game[i];
    button.draw();
  }

  drawGameTexts();
  cursor.draw();
}

function drawMenu() {
  createMenuCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text('menu screen', width / 2 - 80, height / 2);
  textSize(defaultTextSize);
}

function drawHelp() {
  createHelpCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text('help screen', width / 2 - 70, height / 2);
  textSize(defaultTextSize);
}

function drawUpgrades() {
  createUpgradesCanvas()

  for (let i = 0; i < previews.upgrades.length; i++) {
    preview = previews.upgrades[i];
    preview.draw();
  }

  for (let i = 0; i < buttons.upgrades.length; i++) {
    button = buttons.upgrades[i];
    button.draw();
  }

  cursor.draw();
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

function createGameCanvas() {
  createCanvas(
    cellWH * cellWCount + 1 + GUIW,
    cellWH * cellHCount + 1
  );
  background(GUIColor);
}

function createMenuCanvas() {
  createCanvas(
    500,
    500
  );
  background(230);
}

function createHelpCanvas() {
  createCanvas(
    500,
    500
  );
  background(230);
}

function createUpgradesCanvas() {
  createCanvas(
    upgradesWH,
    upgradesWH
  );
  background(230);
}

function createStatsCanvas() {
  createCanvas(
    500,
    500
  );
  background(230);
}