// TO-DO LIST
// . upgrades
// . click the grid to place selected type
// . click the grid to remove selected type
// . select type by clicking on the icon in the middle of the GUI,
//    the icon can be changed by pressing the arrows on the left and right of it

// uneditable variables
let player;
let cell;
let cells = [];
let images = [];
let totalCells = 0;
let expansionCost;
let cellPurchases = 2;

// editable variables
let cellWidth = 125; // min recommended is 30
let cellHeight = 125; // min recommended is 30
let cellWidthCount = 3; // how many cells in the width you start out with
let cellHeightCount = 4; // how many cells in the height you start out with
let iconSize = 4; // 4 by default
let GUIWidth = 200; // min recommended is 150
let playerSize = 2.2; // 2 by default, 2.2 is small
let fr = 60; // default and max is 60, recommended is 10
let gameSpeed = 1; // default of 1
let cellCost = Math.pow(2, cellPurchases); // how much $ each new cell costs

let meals = 0;
let workers = 0;
let money = 0;
let research = 0;
let energy = 0;
let uranium = 0;

let mealsDiff = 0;
let workersDiff = 0;
let moneyDiff = 0;
let researchDiff = 0;
let energyDiff = 0;
let uraniumDiff = 0;


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
  for (i = 0; i < cells.length - 1; i++) {
    totalCells += cells[i].length;
  }
  return totalCells;
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
      cell.newType("empty");
      cells[j / cellHeight][(i - GUIWidth) / cellWidth + 1] = cell;
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
    `Time spent: ${(Math.floor(millisOnline / 1000))} seconds`,
    `Number of cells: ${totalCells}`,
    `Size: ${cellWidthCount} x ${cellHeightCount}`,
    `Buy land: $${expansionCost}`
  ]

  fill(0);
  for (i = 0; i < textsTop.length; i++) {
    text(textsTop[i], 10, 20 + i * 20);
  }

  for (i = 0; i < textsBottom.length; i++) {
    text(textsBottom[i], 10, height - 20 - i * 20);
  }
}

let step = 0;

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
        cell.drawType();
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
        cell.drawType();
      }
    }
  }

  displayTexts();

  player.draw();
}


class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  newType(type) {
    this.type = type;

    switch (type) {
      case "empty":
        this.typeNum = null;
        break;
      case "farm":
        this.typeNum = 0;
        break;
      case "house":
        this.typeNum = 1;
        break;
      case "office":
        this.typeNum = 2;
        break;
      case "laboratory":
        this.typeNum = 3;
        break;
      case "windmill":
        this.typeNum = 4;
        break;
      case "uranium mine":
        this.typeNum = 5;
        break;
      case "reactor":
        this.typeNum = 6;
        break;
    }
  }

  drawCell() {
    fill(255)
    rect(this.x, this.y, cellWidth, cellHeight);
  }

  drawType() {
    if (typeof this.typeNum == "number") {
      image(images[this.typeNum], this.x + cellWidth / iconSize, this.y + cellHeight / iconSize, cellWidth - 2 * (cellWidth / iconSize), cellHeight - 2 * (cellHeight / iconSize));
    }
  }

  calc() {
    switch (this.type) {
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
      // this.type = "empty";
      cells[this.y / cellHeight][(this.x - GUIWidth) / cellWidth + 1].newType("empty");
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


let typeKeys = [];
typeKeys["192"] = "empty"; // grave accent
typeKeys["49"] = "farm"; // 1
typeKeys["50"] = "house"; // 2
typeKeys["51"] = "office"; // 3
typeKeys["52"] = "laboratory"; // 4
typeKeys["53"] = "windmill"; // 5
typeKeys["54"] = "uranium mine"; // 6
typeKeys["55"] = "reactor"; // 7


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
        text("asdas", 100, 100);
        cellPurchases++;

        cellWidthCount += 1;
        cellHeightCount += 1;
        resizeCanvas(cellWidth * cellWidthCount + 1 + GUIWidth, cellHeight * cellHeightCount + 1);

        // places new cells on the right side
        for (i = 0; i < cells.length; i++) {
          cell = new Cell(GUIWidth + (cells[i].length - 1) * cellWidth, i * cellHeight);
          cell.newType("empty");
          cells[i][cells[i].length] = cell;
        }

        // places new cells on the bottom side
        cells[cells.length] = [];
        cells[cells.length - 1][0] = cells.length * cellHeight;
        for (i = 0; i < cells.length; i++) {
          cell = new Cell(GUIWidth + i * cellWidth, (cells.length - 1) * cellHeight);
          cell.newType("empty");
          cells[cells.length - 1][i + 1] = cell;
        }

        getTotalCells();
        getExpansionCost()
      }
      break;
  }

  //sets a cell to a type that corresponds to the key the user pressed
  if (typeof typeKeys[keyCode] == "string") {
    cells[player.y / cellHeight][(Math.floor(player.x - GUIWidth)) / cellWidth + 1].newType(typeKeys[keyCode]);
  }
}


function mousePressed() { // left-clicking removes the building in the cell
  for (i = 0; i < cells.length; i++) {
    for (j = 1; j < cells.length; j++) {
      cell = cells[i][j];
      cell.clicked();
    }
  }
}