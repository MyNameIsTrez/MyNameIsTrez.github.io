function createGameCanvas() {
  createCanvas(
    cellWH * cellWCount + 1 + GUIWidth,
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
    500,
    500
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