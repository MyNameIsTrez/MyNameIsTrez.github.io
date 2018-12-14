function buyLandRightSide() {
  cellWCount += 1;

  for (let i = 0; i < cells.length; i++) {
    cell = new Cell(GUIW + (cells[i].length - 1) * cellWH, i * cellWH);
    cell.newBuilding('empty');
    cells[i][cells[i].length] = cell;
  }
}


function buyLandBottomSide() {
  cellHCount += 1;

  cells[cells.length] = [];
  cells[cells.length - 1][0] = cells.length * cellWH;
  for (let i = 0; i < cells.length; i++) {
    cell = new Cell(GUIW + i * cellWH, (cells.length - 1) * cellWH);
    cell.newBuilding('empty');
    cells[cells.length - 1][i + 1] = cell;
  }
}


function getExpansionCost() {
  expansionCost = Math.floor(cellCost * (Math.pow(Math.sqrt(totalCells) + 1, 2) - totalCells));
  return expansionCost;
}


function updateBuyLand1() {
  money -= expansionCost;
  cellPurchases++;
  createPreviews();
}


function updateBuyLand2() {
  createGameCanvas()
  getTotalCells();
  getExpansionCost();
  updateButtonBuyLand();
  createButtons();
}


function buyLand() {
  if (money >= expansionCost) {
    if (cellWCount < maxCellWCount && cellHCount < maxCellHCount) {
      updateBuyLand1()

      buyLandRightSide()
      buyLandBottomSide()

      updateBuyLand2()
    } else if (cellWCount < maxCellWCount) {
      updateBuyLand1()

      buyLandRightSide()

      updateBuyLand2()
    } else if (cellHCount < maxCellHCount) {
      updateBuyLand1()

      buyLandBottomSide()

      updateBuyLand2()
    }
  }
}