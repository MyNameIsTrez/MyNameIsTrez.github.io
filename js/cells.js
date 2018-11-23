class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  newBuilding(building) {
    this.building = building;

    switch (this.building) {
      case 'empty':
        this.building = null;
        break;
      case 'farm':
        this.building = 'farm';
        break;
      case 'house':
        this.building = 'house';
        break;
      case 'office':
        this.building = 'office';
        break;
      case 'laboratory':
        this.building = 'laboratory';
        break;
      case 'windmill':
        this.building = 'windmill';
        break;
      case 'uranium_mine':
        this.building = 'uranium_mine';
        break;
      case 'reactor':
        this.building = 'reactor';
        break;
    }
  }

  drawCell() {
    fill(255)
    stroke(0);
    rect(this.x, this.y, cellWH, cellWH);
  }

  drawBuilding() {
    for (let i in buildings) {
      if (i === this.building) {
        image(
          images[buildings[i][0]],
          this.x + (cellWH / 2 - iconSize / 2),
          this.y + (cellWH / 2 - iconSize / 2),
          cellWH - 2 * (cellWH / 2 - iconSize / 2),
          cellWH - 2 * (cellWH / 2 - iconSize / 2)
        );
      }
    }
  }

  calc() {
    switch (this.building) {
      case 'farm':
        meals += buildings['farm'][3][0] * upgrades['farm'][0] + upgrades['farm'][1];
        break;
      case 'house':
        if (meals >= buildings['house'][2][0]) {
          meals -= buildings['house'][2][0];
          workers += buildings['house'][3][0];
        }
        break;
      case 'office':
        if (workers >= buildings['office'][2][0]) {
          workers -= buildings['office'][2][0];
          money += buildings['office'][3][0];
        }
        break;
      case 'laboratory':
        if (money >= 8) {
          money -= buildings['laboratory'][2][0];
          research += buildings['laboratory'][3][0];
        }
        break;
      case 'windmill':
        energy += buildings['windmill'][3][0];
        break;
      case 'uranium_mine':
        if (money >= 16 && workers >= 2) {
          money -= buildings['uranium_mine'][2][0];;
          workers -= buildings['uranium_mine'][2][1];;
          uranium += buildings['uranium_mine'][3][0];
        }
        break;
      case 'reactor':
        if (workers >= 1 && money >= 1 && uranium >= 1) {
          workers -= buildings['reactor'][2][0];;
          money -= buildings['reactor'][2][1];;
          uranium -= buildings['reactor'][2][2];;
          energy += buildings['reactor'][3][0];
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
      cells
      [this.y / cellWH][(this.x - GUIW) / cellWH + 1]
        .newBuilding(selectedBuilding);
    }
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

  for (let i = 0; i < cells.length; i++) {
    for (let j = 1; j < cells[i].length; j++) {
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


function getTotalCells() {
  totalCells = cellWCount * cellHCount;
}


function createCells() {
  for (let j = 0; j < height - cellWH; j += cellWH) {
    cells[j / cellWH] = [];
    cells[j / cellWH][0] = j;
    for (let i = GUIW; i < width - cellWH; i += cellWH) {
      cell = new Cell(i, j);
      cell.newBuilding('empty');
      cells[j / cellWH][(i - GUIW) / cellWH + 1] = cell;
    }
  }
}