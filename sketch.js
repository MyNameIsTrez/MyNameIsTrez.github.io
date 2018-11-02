// TO-DO LIST
// . upgrades
// . move resources to bottom/top of screen
// . buy 4x4 squares of land in all 4 directions
//   by adding a second selector that can be moved with the keyboard


function setup() {
  frameRate(fr);
  gameCanvas();
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


// uneditable variables
let images = [];
let cells = [];
let previews = [];
let buttons = [];
let cellPurchases = 2;
let step = 0;
let previewWidth = 0;
let previewHeight = 0;

let mealsDiff = 0;
let workersDiff = 0;
let moneyDiff = 0;
let researchDiff = 0;
let energyDiff = 0;
let uraniumDiff = 0;

// editable variables
let cellWH = 75; // a cell's width and height in px
let cellWCount = 4; // how many cells in the width you start out with
let cellHCount = 8; // how many cells in the height you start out with
let iconSize = 50; // should be between 25px and 100px
let previewSize = 40; // should be between 25px and 50px
let GUIWidth = 150; // min recommended is 150
let playerSize = 2.2; // 2 by default, 2.2 is small
let fr = 60; // default and max is 60, recommended is 10
let gameSpeed = 1; // the amount of seconds that pass between every update, default of 1, min of 0.1
let cellCost = Math.pow(4, cellPurchases); // how much $ each new cell costs
let lmbMode = "placing"; // whether the left mouse button will do "placing" or "removing" by default
let lmbBuilding = "farm"; // the default building to place
let curWindow = "game"; // the window that pops up at the start of the game, "menu" or "game"
let pixelsWidePerWord = 6; // how many pixels wide each word is assumed to be on average
let maxPreviewRow = 3; // the max amount of building previews are in each row
let textXOffset = 10; // the x offset of the text from the left side of the canvas
let previewXOffset = 10; // the x offset of the building preview from the left side of the canvas
let previewYOffset = -55; // the y offset of the building preview from the middle of the canvas
let defaultTextSize = 12; // the default text size
let bigTextSize = 32; // the text size for big text

// colors of the elements
let GUIColor = [169, 206, 244]; // background color of the GUI
let previewBgClr = [0, 255, 0, 100]; // selected preview background color
let buttonClr = [144, 169, 183]; // button background color

// starting resources
let meals = 0;
let workers = 0;
let money = 0;
let research = 0;
let energy = 0;
let uranium = 0;

let buildings = {
0: "farm",
1: "house",
2: "office",
3: "laboratory",
4: "windmill",
5: "uranium mine",
6: "reactor",
7: "empty",
};

let buildingKeys = {
49: "farm", // keyboard 1
50: "house", // keyboard 2
51: "office", // keyboard 3
52: "laboratory", // keyboard 4
53: "windmill", // keyboard 5
54: "uranium mine", // keyboard 6
55: "reactor", // keyboard 7
192: "empty", // keyboard grave accent
};

function loadImages() {
  images.push(loadImage("images/farm.png"));
  images.push(loadImage("images/house.png"));
  images.push(loadImage("images/office.png"));
  images.push(loadImage("images/laboratory.png"));
  images.push(loadImage("images/windmill.png"));
  images.push(loadImage("images/uranium mine.png"));
  images.push(loadImage("images/reactor.png"));
  images.push(loadImage("images/cancel.png"));
}


function getTotalCells() {
  totalCells = cellWCount * cellHCount;
}


function createCells() {
  for (j = 0; j < height - cellWH; j += cellWH) {
    cells[j / cellWH] = [];
    cells[j / cellWH][0] = j;
    for (i = GUIWidth; i < width - cellWH; i += cellWH) {
      cell = new Cell(i, j);
      cell.newBuilding("empty");
      cells[j / cellWH][(i - GUIWidth) / cellWH + 1] = cell;
    }
  }
}


function createPreviews() {
  for (k = 0; k < images.length; k++) {
    preview = new Preview(
      k,
      GUIWidth / 2 - 65 + previewWidth * previewSize + previewWidth * 5,
      previewYOffset + previewHeight * previewSize + previewHeight * 5
    );

    previews[k] = preview;
    previewWidth++;

    if (previewWidth == maxPreviewRow) {
      previewWidth = 0;
      previewHeight++;
    }
  }
}


function updateButtonData() {
  buttonData = [];
  buttonDataLength = 6;

  buttonData.push("menu");
  buttonData.push("Menu");
  buttonData.push(GUIWidth / 2 - 50);
  buttonData.push(40);
  buttonData.push(50 - 2.5);
  buttonData.push(20);

  buttonData.push("help");
  buttonData.push("Help");
  buttonData.push(GUIWidth / 2 - 50 + 50 + 2.5);
  buttonData.push(40);
  buttonData.push(50 - 2.5);
  buttonData.push(20);

  buttonData.push("buy land");
  buttonData.push(`Buy Land: $${expansionCost}`);
  buttonData.push(GUIWidth / 2 - 50);
  buttonData.push(65);
  buttonData.push(100);
  buttonData.push(20);

  buttonData.push("upgrades");
  buttonData.push("Upgrades");
  buttonData.push(GUIWidth / 2 - 50);
  buttonData.push(90);
  buttonData.push(100);
  buttonData.push(20);

  buttonData.push("stats");
  buttonData.push("Stats");
  buttonData.push(GUIWidth / 2 - 50);
  buttonData.push(115);
  buttonData.push(100);
  buttonData.push(20);
}


function updateButtons() {
  buttons = [];
  for (i = 0; i < buttonData.length / buttonDataLength; i++) {
    button = new Button(
      buttonData[i * buttonDataLength],
      buttonData[1 + i * buttonDataLength],
      buttonData[2 + i * buttonDataLength],
      buttonData[3 + i * buttonDataLength],
      buttonData[4 + i * buttonDataLength],
      buttonData[5 + i * buttonDataLength]
    );
    buttons[i] = button;
  }
}


function getExpansionCost() {
  expansionCost = Math.floor(cellCost * (Math.pow(Math.sqrt(totalCells) + 1, 2) - totalCells));
  return expansionCost;
}


function gameCanvas() {
  createCanvas(
    cellWH * cellWCount + 1 + GUIWidth,
    cellWH * cellHCount + 1
  );
  background(GUIColor);
}

function menuCanvas() {
  createCanvas(
    500,
    500
  );
  background(230);
}

function helpCanvas() {
  createCanvas(
    500,
    500
  );
  background(230);
}

function upgradesCanvas() {
  createCanvas(
    500,
    500
  );
  background(230);
}

function statsCanvas() {
  createCanvas(
    500,
    500
  );
  background(230);
}


function changeDiff(diff) {
  if (diff < 0 || diff == 0) {
    return diff
  } else if (diff > 0) {
    return "+" + diff
  }
}


function drawGameTexts() {
  texts = [
    `Meals: ${meals} (${changeDiff(mealsDiff)})`,
    `Workers: ${workers} (${changeDiff(workersDiff)})`,
    `Money: $${money} (${changeDiff(moneyDiff)})`,
    `Research: ${research} (${changeDiff(researchDiff)})`,
    `Energy: ${energy} (${changeDiff(energyDiff)})`,
    `Uranium: ${uranium} (${changeDiff(uraniumDiff)})`
  ]

  fill(0);
  noStroke();

  for (i = 0; i < texts.length; i++) {
    text(texts[i], GUIWidth / 2 - 40, 30 + i * 20);
  }
}


function calcCells() {
  step = 0;

  pastMeals = meals;
  pastWorkers = workers;
  pastMoney = money;
  pastResearch = research;
  pastEnergy = energy;
  pastUranium = uranium;

  for (i = 0; i < cells.length; i++) {
    for (j = 1; j < cells[i].length; j++) {
      cell = cells[i][j];
      cell.drawCell();
      cell.drawBuilding();
      cell.calc()
    }
    mealsDiff = meals - pastMeals;
    workersDiff = workers - pastWorkers;
    moneyDiff = money - pastMoney;
    researchDiff = research - pastResearch;
    energyDiff = energy - pastEnergy;
    uraniumDiff = uranium - pastUranium;
  }
}


function drawGame() {
  gameCanvas();

  // calculates whether the amount of seconds that pass
  // between every update have passed
  step++;
  if (step == fr * gameSpeed) {
    calcCells();
  } else {
    for (i = 0; i < cells.length; i++) {
      for (j = 1; j < cells[i].length; j++) {
        cell = cells[i][j];
        cell.drawCell();
        cell.drawBuilding();
      }
    }
  }

  for (i = 0; i < previews.length; i++) {
    preview = previews[i];
    preview.draw();
  }

  for (i = 0; i < buttons.length; i++) {
    button = buttons[i];
    button.draw();
  }

  drawGameTexts();
  player.draw();
}


function drawMenu() {
  menuCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text("menu screen", width / 2 - 80, height / 2);
  textSize(defaultTextSize);
}


function drawHelp() {
  helpCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text("help screen", width / 2 - 70, height / 2);
  textSize(defaultTextSize);
}


function drawUpgrades() {
  upgradesCanvas()
  fill(0);
  noStroke();
  textSize(bigTextSize);
  text("upgrades screen", width / 2 - 110, height / 2);
  textSize(defaultTextSize);
}


function drawStats() {
  statsCanvas()
  let millisOnline = millis();

  texts = [
    `Time spent: ${(Math.floor(millisOnline / 1000))} seconds`,
    `Number of cells: ${totalCells}`,
    `Size: ${cellWCount} x ${cellHCount}`
  ]

  fill(0);
  textSize(bigTextSize)
  noStroke();

  for (j = 0; j < texts.length; j++) {
    text(texts[j], width / 2 - 160, height / 2 - 50 + j * 50);
  }
  textSize(defaultTextSize);
}


class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  newBuilding(building) {
    this.building = building;

    switch (this.building) {
      case "empty":
        this.buildingNum = null;
        break;
      case "farm":
        this.buildingNum = 0;
        break;
      case "house":
        this.buildingNum = 1;
        break;
      case "office":
        this.buildingNum = 2;
        break;
      case "laboratory":
        this.buildingNum = 3;
        break;
      case "windmill":
        this.buildingNum = 4;
        break;
      case "uranium mine":
        this.buildingNum = 5;
        break;
      case "reactor":
        this.buildingNum = 6;
        break;
    }
  }

  drawCell() {
    fill(255)
    stroke(0);
    rect(this.x, this.y, cellWH, cellWH);
  }

  drawBuilding() {
    if (typeof this.buildingNum == "number") {
      image(
        images[this.buildingNum],
        this.x + (cellWH / 2 - iconSize / 2),
        this.y + (cellWH / 2 - iconSize / 2),
        cellWH - 2 * (cellWH / 2 - iconSize / 2),
        cellWH - 2 * (cellWH / 2 - iconSize / 2)
      );
    }
  }

  calc() {
    switch (this.building) {
      case "farm":
        meals += 3;
        break;
      case "house":
        if (meals >= 1) {
          meals -= 1;
          workers += 2;
        }
        break;
      case "office":
        if (workers >= 5) {
          workers -= 5;
          money += 1;
        }
        break;
      case "laboratory":
        if (money >= 8) {
          money -= 8;
          research += 2;
        }
        break;
      case "windmill":
        energy += 1;
        break;
      case "uranium mine":
        if (money >= 16 && workers >= 2) {
          money -= 16;
          workers -= 2;
          uranium += 1;
        }
        break;
      case "reactor":
        if (workers >= 1 && money >= 1 && uranium >= 1) {
          workers--;
          money--;
          uranium--;
          energy += 20;
        }
        break;
    }
  }

  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + cellWH)) &&
      (mouseY > this.y) &&
      (mouseY < (this.y + cellWH))
    ) {
      if (lmbMode == "placing") {
        cells
          [this.y / cellWH][(this.x - GUIWidth) / cellWH + 1]
          .newBuilding(lmbBuilding);
      } else if (lmbMode == "removing") {
        cells
          [this.y / cellWH][(this.x - GUIWidth) / cellWH + 1]
          .newBuilding("empty");
      }
    }
  }
}


class Player {
  constructor() {
    this.x = GUIWidth;
    this.y = 0;
  }

  draw() {
    fill(255, 255, 63)
    stroke(0);
    rect(
      this.x + cellWH / playerSize,
      this.y + cellWH / playerSize,
      cellWH - 2 * cellWH / playerSize,
      cellWH - 2 * cellWH / playerSize
    );
  }
}


class Preview {
  constructor(buildingNum, x, y) {
    this.buildingNum = buildingNum;
    this.x = x;
    this.y = y;
  }

  draw() {
    if (lmbBuilding == buildings[this.buildingNum] && lmbMode == "placing") {
      noStroke();
      fill(previewBgClr);
      rect(
        this.x,
        this.y + height / 2,
        previewSize,
        previewSize
      );
    }

    image(
      images[this.buildingNum],
      this.x, this.y + height / 2,
      previewSize,
      previewSize
    );
  }

  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + previewSize)) &&
      (mouseY > (this.y + (height / 2))) &&
      (mouseY < (this.y + (previewSize + (height / 2))))
    ) {
      if (lmbMode == "removing") {
        lmbMode = "placing";
      }

      lmbBuilding = buildings[this.buildingNum];
    }
  }
}


class Button {
  constructor(type, drawText, x, y, w, h) {
    this.type = type;
    this.drawText = drawText;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    fill(buttonClr);
    noStroke();
    rect(this.x, height - this.y, this.w, this.h);
    fill(0);
    text(
      this.drawText,
      this.x + ((this.w / 2) - ((this.drawText.length * pixelsWidePerWord) / 2)),
      height - this.y + (this.h / 1.5)
    );
  }

  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + this.w)) &&
      (mouseY > (height - this.y)) &&
      (mouseY < ((height - this.y) + this.h))
    ) {
      switch (this.type) {
        case "buy land":
          buyLand();
          break;
        case "menu":
          curWindow = "menu"
          break;
        case "help":
          curWindow = "help"
          break;
        case "upgrades":
          curWindow = "upgrades"
          break;
        case "stats":
          curWindow = "stats"
          break;
      }
    }
  }
}


function buyLandRightSide() {
  for (i = 0; i < cells.length; i++) {
    cell = new Cell(GUIWidth + (cells[i].length - 1) * cellWH, i * cellWH);
    cell.newBuilding("empty");
    cells[i][cells[i].length] = cell;
  }
}


function buyLandBottomSide() {
  cells[cells.length] = [];
  cells[cells.length - 1][0] = cells.length * cellWH;
  for (i = 0; i < cells.length; i++) {
    cell = new Cell(GUIWidth + i * cellWH, (cells.length - 1) * cellWH);
    cell.newBuilding("empty");
    cells[cells.length - 1][i + 1] = cell;
  }
}


function buyLand() {
  if (money >= expansionCost) {
    money -= expansionCost;
    cellPurchases++;

    cellWCount += 1;
    cellHCount += 1;

    gameCanvas()

    // places new cells on the right side
    buyLandRightSide()

    // places new cells on the bottom side
    buyLandBottomSide()

    getTotalCells();
    getExpansionCost();
    updateButtonData();
    updateButtons();
  }
}


function keyPressed() {
  switch (keyCode) {
    case 87: // up
      if (player.y >= cellWH) {
        player.y -= cellWH;
      }
      break;
    case 65: // left
      if (player.x >= cellWH + GUIWidth) {
        player.x -= cellWH;
      }
      break;
    case 83: // down
      if (player.y < height - cellWH - 1) {
        player.y += cellWH;
      }
      break;
    case 68: // right
      if (player.x < width - cellWH - 1) {
        player.x += cellWH;
      }
      break;
    case UP_ARROW: // up
      if (player.y >= cellWH) {
        player.y -= cellWH;
      }
      break;
    case LEFT_ARROW: // left
      if (player.x >= cellWH + GUIWidth) {
        player.x -= cellWH;
      }
      break;
    case DOWN_ARROW: // down
      if (player.y < height - cellWH - 1) {
        player.y += cellWH;
      }
      break;
    case RIGHT_ARROW: // right
      if (player.x < width - cellWH - 1) {
        player.x += cellWH;
      }
      break;
    case 66: // b, buys cells on the right and bottom
      buyLand();
      break;
    case 69: // e, place/remove building
      if (lmbMode == "placing") {
      cells
        [player.y / cellWH][(Math.floor(player.x - GUIWidth)) / cellWH + 1]
        .newBuilding(lmbBuilding); // place selected building
      } else if (lmbMode == "removing") {
      cells
        [player.y / cellWH][(Math.floor(player.x - GUIWidth)) / cellWH + 1]
        .newBuilding("empty"); // replace building with an empty cell
      }
      break;
    case 16: // shift
      if (lmbMode == "placing") {
        lmbMode = "removing";
      } else if (lmbMode == "removing") {
        lmbMode = "placing";
      }
      break;
    case 27: // escape
      curWindow = "game";
      break;
  }

  // sets a cell to a building that corresponds to the key the user pressed

  if (keyCode in buildingKeys) {
    if (lmbMode == "removing") {
      lmbMode = "placing";
    }

    // the keycode for the number 3 is 51, so 51 - 49 = 2, building three.
    lmbBuilding = buildings[keyCode - 49];
  }
}


function mousePressed() { // left-clicking removes the building in the cell
  for (i = 0; i < cells.length; i++) {
    for (j = 1; j < cells[i].length; j++) {
      cell = cells[i][j];
      cell.clicked();
    }
  }

  for (i = 0; i < previews.length; i++) {
    preview = previews[i];
    preview.clicked();
  }

  for (i = 0; i < buttons.length; i++) {
    button = buttons[i];
    button.clicked();
  }
}
