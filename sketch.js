// TO-DO LIST
// . upgrades
// . give the screen width and height as a seventh parameter for the tabs


// uneditable variables
let images = [];
let cells = [];
let buildingPreviews = [];
let buttons = [];
let cellPurchases = 2;
let step = 0;
let buildingPreviewWidth = 0;
let buildingPreviewHeight = 0;

let mealsDiff = 0;
let workersDiff = 0;
let moneyDiff = 0;
let researchDiff = 0;
let energyDiff = 0;
let uraniumDiff = 0;

// editable variables
let cellWidth = 100; // min recommended is 30
let cellHeight = 100; // min recommended is 30
let cellWidthCount = 2; // how many cells in the width you start out with
let cellHeightCount = 4; // how many cells in the height you start out with
let iconSize = 50; // should be between 25px and 100px
let buildingPreviewIconSize = 40; // should be between 25px and 50px
let GUIWidth = 150; // min recommended is 150
let playerSize = 2.2; // 2 by default, 2.2 is small
let fr = 60; // default and max is 60, recommended is 10
let gameSpeed = 1; // the amount of seconds that pass between every update, default of 1, min of 0.1
let cellCost = Math.pow(5, cellPurchases); // how much $ each new cell costs
let leftClickMode = "placing"; // whether the left mouse button will do "placing" or "removing" by default
let leftClickBuilding = "farm"; // the default building to place
let popupWindow = "game"; // the window that pops up at the start of the game, "menu" or "game"
let pixelsWidePerWord = 6; // how many pixels wide each word is assumed to be on average
let maxBuildingPreviewRow = 3; // the max amount of building previews are in each row
let textXOffset = 10; // the x offset of the text from the left side of the canvas
let buildingPreviewXOffset = 10; // the x offset of the building preview from the left side of the canvas
let buildingPreviewYOffset = -55; // the y offset of the building preview from the middle of the canvas
let defaultTextSize = 12; // the default text size
let bigTextSize = 32; // the text size for big text

// starting resources
let meals = 0;
let workers = 0;
let money = 0;
let research = 0;
let energy = 0;
let uranium = 0;


function loadImages() {
  images.push(loadImage("farm.png"));
  images.push(loadImage("house.png"));
  images.push(loadImage("office.png"));
  images.push(loadImage("laboratory.png"));
  images.push(loadImage("windmill.png"));
  images.push(loadImage("uranium mine.png"));
  images.push(loadImage("reactor.png"));
}

let buildings = [];
buildings[0] = "farm";
buildings[1] = "house";
buildings[2] = "office";
buildings[3] = "laboratory";
buildings[4] = "windmill";
buildings[5] = "uranium mine";
buildings[6] = "reactor";

let buildingKeys = [];
buildingKeys["192"] = "empty"; // grave accent
buildingKeys["49"] = "farm"; // 1
buildingKeys["50"] = "house"; // 2
buildingKeys["51"] = "office"; // 3
buildingKeys["52"] = "laboratory"; // 4
buildingKeys["53"] = "windmill"; // 5
buildingKeys["54"] = "uranium mine"; // 6
buildingKeys["55"] = "reactor"; // 7


function getTotalCells() {
  totalCells = cellWidthCount * cellHeightCount;
}


function createCells() {
  for (j = 0; j < height - cellHeight; j += cellHeight) {
    cells[j / cellHeight] = [];
    cells[j / cellHeight][0] = j;
    for (i = GUIWidth; i < width - cellWidth; i += cellWidth) {
      cell = new Cell(i, j);
      cell.newBuilding("empty");
      cells[j / cellHeight][(i - GUIWidth) / cellWidth + 1] = cell;
    }
  }
}


function createBuildingPreviews() {
  for (k = 0; k < buildings.length; k++) {
    buildingPreview = new BuildingPreview(
      k,
      GUIWidth / 2 - 65 + buildingPreviewWidth * buildingPreviewIconSize + buildingPreviewWidth * 5,
      buildingPreviewYOffset + buildingPreviewHeight * buildingPreviewIconSize + buildingPreviewHeight * 5
    );
    buildingPreviews[k] = buildingPreview;
    buildingPreviewWidth++;
    if (buildingPreviewWidth == maxBuildingPreviewRow) {
      buildingPreviewWidth = 0;
      buildingPreviewHeight++;
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
    cellWidth * cellWidthCount + 1 + GUIWidth,
    cellHeight * cellHeightCount + 1
  );
  background(230);
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


function setup() {
  frameRate(fr);
  gameCanvas();
  loadImages()

  createCells();
  getTotalCells()
  getExpansionCost()

  createBuildingPreviews();

  updateButtonData();
  updateButtons();

  player = new Player();
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

  for (i = 0; i < buildingPreviews.length; i++) {
    buildingPreview = buildingPreviews[i];
    buildingPreview.draw();
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
    `Size: ${cellWidthCount} x ${cellHeightCount}`
  ]

  fill(0);
  textSize(bigTextSize)
  noStroke();

  for (j = 0; j < texts.length; j++) {
    text(texts[j], width / 2 - 160, height / 2 - 50 + j * 50);
  }
  textSize(defaultTextSize);
}


function draw() {
  switch (popupWindow) {
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
    rect(this.x, this.y, cellWidth, cellHeight);
  }

  drawBuilding() {
    if (typeof this.buildingNum == "number") {
      image(
        images[this.buildingNum],
        this.x + (cellWidth / 2 - iconSize / 2),
        this.y + (cellHeight / 2 - iconSize / 2),
        cellWidth - 2 * (cellWidth / 2 - iconSize / 2),
        cellHeight - 2 * (cellHeight / 2 - iconSize / 2)
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
      (mouseX < (this.x + cellWidth)) &&
      (mouseY > this.y) &&
      (mouseY < (this.y + cellHeight))
    ) {
      if (leftClickMode == "placing") {
        cells
          [this.y / cellHeight][(this.x - GUIWidth) / cellWidth + 1]
          .newBuilding(leftClickBuilding);
      } else if (leftClickMode == "removing") {
        cells
          [this.y / cellHeight][(this.x - GUIWidth) / cellWidth + 1]
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
      this.x + cellWidth / playerSize,
      this.y + cellHeight / playerSize,
      cellWidth - 2 * cellWidth / playerSize,
      cellHeight - 2 * cellHeight / playerSize
    );
  }
}


class BuildingPreview {
  constructor(buildingNum, x, y) {
    this.buildingNum = buildingNum;
    this.x = x;
    this.y = y;
  }

  draw() {
    if (leftClickBuilding == buildings[this.buildingNum] && leftClickMode == "placing") {
      noStroke();
      fill(0, 200, 0, 75);
      rect(
        this.x,
        this.y + height / 2,
        buildingPreviewIconSize,
        buildingPreviewIconSize
      );
    }

    image(
      images[this.buildingNum],
      this.x, this.y + height / 2,
      buildingPreviewIconSize,
      buildingPreviewIconSize
    );
  }

  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + buildingPreviewIconSize)) &&
      (mouseY > (this.y + (height / 2))) &&
      (mouseY < (this.y + (buildingPreviewIconSize + (height / 2))))
    ) {
      if (leftClickMode == "removing") {
        leftClickMode = "placing";
      }
      
      leftClickBuilding = buildings[this.buildingNum];
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
    fill(150, 100);
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
          popupWindow = "menu"
          break;
        case "help":
          popupWindow = "help"
          break;
        case "upgrades":
          popupWindow = "upgrades"
          break;
        case "stats":
          popupWindow = "stats"
          break;
      }
    }
  }
}


function buyLandRightSide() {
  for (i = 0; i < cells.length; i++) {
    cell = new Cell(GUIWidth + (cells[i].length - 1) * cellWidth, i * cellHeight);
    cell.newBuilding("empty");
    cells[i][cells[i].length] = cell;
  }
}


function buyLandBottomSide() {
  cells[cells.length] = [];
  cells[cells.length - 1][0] = cells.length * cellHeight;
  for (i = 0; i < cells.length; i++) {
    cell = new Cell(GUIWidth + i * cellWidth, (cells.length - 1) * cellHeight);
    cell.newBuilding("empty");
    cells[cells.length - 1][i + 1] = cell;
  }
}


function buyLand() {
  if (money >= expansionCost) {
    money -= expansionCost;
    cellPurchases++;

    cellWidthCount += 1;
    cellHeightCount += 1;
    gameCanvas()
    // resizeCanvas(
    //   cellWidth * cellWidthCount + 1 + GUIWidth,
    //   cellHeight * cellHeightCount + 1
    // );

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
      if (player.y >= cellHeight) {
        player.y -= cellHeight;
      }
      break;
    case 65: // left
      if (player.x >= cellWidth + GUIWidth) {
        player.x -= cellWidth;
      }
      break;
    case 83: // down
      if (player.y < height - cellHeight - 1) {
        player.y += cellHeight;
      }
      break;
    case 68: // right
      if (player.x < width - cellWidth - 1) {
        player.x += cellWidth;
      }
      break;
    case UP_ARROW: // up
      if (player.y >= cellHeight) {
        player.y -= cellHeight;
      }
      break;
    case LEFT_ARROW: // left
      if (player.x >= cellWidth + GUIWidth) {
        player.x -= cellWidth;
      }
      break;
    case DOWN_ARROW: // down
      if (player.y < height - cellHeight - 1) {
        player.y += cellHeight;
      }
      break;
    case RIGHT_ARROW: // right
      if (player.x < width - cellWidth - 1) {
        player.x += cellWidth;
      }
      break;
    case 66: // b, buys cells on the right and bottom
      buyLand();
      break;
    case 16: // shift
      if (leftClickMode == "placing") {
        leftClickMode = "removing";
      } else if (leftClickMode == "removing") {
        leftClickMode = "placing";
      }
      break;
    case 27: // escape
      popupWindow = "game";
      break;
  }

  // sets a cell to a building that corresponds to the key the user pressed
  if (typeof buildingKeys[keyCode] == "string") {
    cells
      [player.y / cellHeight][(Math.floor(player.x - GUIWidth)) / cellWidth + 1]
      .newBuilding(buildingKeys[keyCode]);
  }
}


function mousePressed() { // left-clicking removes the building in the cell
  for (i = 0; i < cells.length; i++) {
    for (j = 1; j < cells[i].length; j++) {
      cell = cells[i][j];
      cell.clicked();
    }
  }

  for (i = 0; i < buildingPreviews.length; i++) {
    buildingPreview = buildingPreviews[i];
    buildingPreview.clicked();
  }

  for (i = 0; i < buttons.length; i++) {
    button = buttons[i];
    button.clicked();
  }
}