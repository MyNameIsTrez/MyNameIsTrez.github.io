function buyLandRightSide() {
  for (let i = 0; i < cells.length; i++) {
    cell = new Cell(GUIWidth + (cells[i].length - 1) * cellWH, i * cellWH);
    cell.newBuilding("empty");
    cells[i][cells[i].length] = cell;
  }
}


function buyLandBottomSide() {
  cells[cells.length] = [];
  cells[cells.length - 1][0] = cells.length * cellWH;
  for (let i = 0; i < cells.length; i++) {
    cell = new Cell(GUIWidth + i * cellWH, (cells.length - 1) * cellWH);
    cell.newBuilding("empty");
    cells[cells.length - 1][i + 1] = cell;
  }
}


function getExpansionCost() {
  expansionCost = Math.floor(cellCost * (Math.pow(Math.sqrt(totalCells) + 1, 2) - totalCells));
  return expansionCost;
}


function buyLand() {
  if (money >= expansionCost) {
    money -= expansionCost;
    cellPurchases++;

    cellWCount += 1;
    cellHCount += 1;

    createGameCanvas()

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