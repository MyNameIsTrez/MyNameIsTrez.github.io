// TO-DO LIST
// . upgrades
// . buy the land by using a button that utilises the same button class as the building preview buttons do
// . building preview icon can be changed by pressing the arrows on the left and right of it
// . make a 'help' button in the GUI that when clicked pops up a box with the keys and instructions
// . clean up code


// uneditable variables
let cells = [];
let images = [];
let buildingPreviews = [];
let cellPurchases = 2;
let step = 0;
let previewWidth = 0;
let previewHeight = 0;

// editable variables
let cellWidth = 100; // min recommended is 30
let cellHeight = 100; // min recommended is 30
let cellWidthCount = 1; // how many cells in the width you start out with
let cellHeightCount = 4; // how many cells in the height you start out with
let iconSize = 50; // should be between 25px and 100px
let previewIconSize = 50; // should be between 25px and 50px
let GUIWidth = 250; // min recommended is 150
let playerSize = 2.2; // 2 by default, 2.2 is small
let fr = 60; // default and max is 60, recommended is 10
let gameSpeed = 1; // default of 1
let cellCost = Math.pow(3, cellPurchases); // how much $ each new cell costs
let leftClickMode = "placing"; // whether the left mouse button will do "placing" or "removing" by default
let leftClickBuilding = "farm"; // the default building to place

let meals = 0;
let workers = 0;
let money = 200;
let research = 0;
let energy = 0;
let uranium = 0;

let mealsDiff = 0;
let workersDiff = 0;
let moneyDiff = 0;
let researchDiff = 0;
let energyDiff = 0;
let uraniumDiff = 0;


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


function loadImages() {
  images.push(loadImage("farm.png"));
  images.push(loadImage("house.png"));
  images.push(loadImage("office.png"));
  images.push(loadImage("laboratory.png"));
  images.push(loadImage("windmill.png"));
  images.push(loadImage("uranium mine.png"));
  images.push(loadImage("reactor.png"));
}


function getTotalCells() {
  totalCells = cellWidthCount * cellHeightCount;
}


function setup() {
  frameRate(fr);

  loadImages()

  createCanvas(cellWidth * cellWidthCount + 1 + GUIWidth, cellHeight * cellHeightCount + 1);

  player = new Player();

  for (j = 0; j < height - cellHeight; j += cellHeight) {
    cells[j / cellHeight] = [];
    cells[j / cellHeight][0] = j;
    for (i = GUIWidth; i < width - cellWidth; i += cellWidth) {
      cell = new Cell(i, j);
      cell.newBuilding("empty");
      cells[j / cellHeight][(i - GUIWidth) / cellWidth + 1] = cell;
    }
  }

  for (k = 0; k < buildings.length; k++) {
    buildingPreview = new BuildingPreview(k, previewWidth * previewIconSize, previewHeight * previewIconSize);
    buildingPreviews[k] = buildingPreview;
    previewWidth++;
    if (previewWidth == 3) {
      previewWidth = 0;
      previewHeight++;
    }
  }

  getTotalCells()
  getExpansionCost()
}


function changeDiff(diff) {
  if (diff < 0 || diff == 0) {
    return diff
  } else if (diff > 0) {
    return "+" + diff
  }
}


function getExpansionCost() {
  expansionCost = Math.floor(cellCost * (Math.pow(Math.sqrt(totalCells) + 1, 2) - totalCells));
  return expansionCost;
}


function displayTexts() {
  let millisOnline = millis();

  textsTop = [
    `Meals: ${meals} (${changeDiff(mealsDiff)})`,
    `Workers: ${workers} (${changeDiff(workersDiff)})`,
    `Money: $${money} (${changeDiff(moneyDiff)})`,
    `Research: ${research} (${changeDiff(researchDiff)})`,
    `Energy: ${energy} (${changeDiff(energyDiff)})`,
    `Uranium: ${uranium} (${changeDiff(uraniumDiff)})`
  ]

  textsBottom = [
    `Left-click mode: ${leftClickMode} ${leftClickBuilding}`,
    `Time spent: ${(Math.floor(millisOnline / 1000))} seconds`,
    `Number of cells: ${totalCells}`,
    `Buy land: $${expansionCost}`,
    `Size: ${cellWidthCount} x ${cellHeightCount}`
  ]

  fill(0);
  for (i = 0; i < textsTop.length; i++) {
    text(textsTop[i], 10, 20 + i * 20);
  }

  for (i = 0; i < textsBottom.length; i++) {
    text(textsBottom[i], 10, height - 20 - i * 20);
  }
}

function draw() {
  background(220);

  step++;
  if (step == fr / gameSpeed) { // always update cells after 1s
    step = 0;

    a = meals;
    b = workers;
    c = money;
    d = research;
    e = energy;
    f = uranium;

    for (i = 0; i < cells.length; i++) {
      for (j = 1; j < cells[i].length; j++) {
        cell = cells[i][j];
        cell.drawCell();
        cell.drawBuilding();
        cell.calc()
      }
      mealsDiff = meals - a;
      workersDiff = workers - b;
      moneyDiff = money - c;
      researchDiff = research - d;
      energyDiff = energy - e;
      uraniumDiff = uranium - f;
    }
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

  displayTexts();
  player.draw();
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
    rect(this.x, this.y, cellWidth, cellHeight);
  }

  drawBuilding() {
    if (typeof this.buildingNum == "number") {
      image(images[this.buildingNum], this.x + (cellWidth / 2 - iconSize / 2), this.y + (cellHeight / 2 - iconSize / 2), cellWidth - 2 * (cellWidth / 2 - iconSize / 2), cellHeight - 2 * (cellHeight / 2 - iconSize / 2));
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
    if (mouseX > this.x && mouseX < this.x + cellWidth && mouseY > this.y && mouseY < this.y + cellHeight) {
      if (leftClickMode == "placing") {
        cells[this.y / cellHeight][(this.x - GUIWidth) / cellWidth + 1].newBuilding(leftClickBuilding);
      } else if (leftClickMode == "removing") {
        cells[this.y / cellHeight][(this.x - GUIWidth) / cellWidth + 1].newBuilding("empty");
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
    rect(this.x + cellWidth / playerSize, this.y + cellHeight / playerSize, cellWidth - 2 * cellWidth / playerSize, cellHeight - 2 * cellHeight / playerSize);
  }
}


class BuildingPreview {
  constructor(buildingNum, x, y) {
    this.buildingNum = buildingNum;
    this.x = x;
    this.y = y;
  }

  draw() {
    fill(100);
    image(images[this.buildingNum], this.x, this.y + height / 2 - 65, previewIconSize, previewIconSize);
  }

  clicked() {
    if (mouseX > this.x && mouseX < this.x + previewIconSize && mouseY > this.y + height / 2 - 65 && mouseY < this.y + previewIconSize + height / 2 - 65) {
      leftClickBuilding = buildings[this.buildingNum];
    }
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
      if (money >= expansionCost) {
        money -= expansionCost;
        cellPurchases++;

        cellWidthCount += 1;
        cellHeightCount += 1;
        resizeCanvas(cellWidth * cellWidthCount + 1 + GUIWidth, cellHeight * cellHeightCount + 1);

        // places new cells on the right side
        for (i = 0; i < cells.length; i++) {
          cell = new Cell(GUIWidth + (cells[i].length - 1) * cellWidth, i * cellHeight);
          cell.newBuilding("empty");
          cells[i][cells[i].length] = cell;
        }

        // places new cells on the bottom side
        cells[cells.length] = [];
        cells[cells.length - 1][0] = cells.length * cellHeight;
        for (i = 0; i < cells.length; i++) {
          cell = new Cell(GUIWidth + i * cellWidth, (cells.length - 1) * cellHeight);
          cell.newBuilding("empty");
          cells[cells.length - 1][i + 1] = cell;
        }

        getTotalCells();
        getExpansionCost()
      }
      break;
    case 16: // shift
      if (leftClickMode == "placing") {
        leftClickMode = "removing";
      } else if (leftClickMode == "removing") {
        leftClickMode = "placing";
      }
      break;
  }

  //sets a cell to a building that corresponds to the key the user pressed
  if (typeof buildingKeys[keyCode] == "string") {
    cells[player.y / cellHeight][(Math.floor(player.x - GUIWidth)) / cellWidth + 1].newBuilding(buildingKeys[keyCode]);
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
}