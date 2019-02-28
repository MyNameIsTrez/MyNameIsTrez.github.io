function saveGame() {
  if (!inputSave.value()) {
    throw `Error: You need to enter your save name!`;
  }
  if (inputSave.value() in saves) {
    throw `Error: A save with that name already exists.`;
  }

  // push the game's settings and the cell-alive state of the first cell
  let aliveCells = [];
  aliveCells.push(cellTickRate, cellWidthHeight, cellWidthCount, cellHeightCount, cells[0][0].alive, []);

  let length = 1;
  for (let y in cells) {
    for (let x in cells[y]) {
      x = int(x);
      if (x === 0 && y > 0) {
        if (cells[y][x].alive === cells[y - 1][cellWidthCount - 1].alive) {
          length++;
        } else {
          aliveCells[5].push(length);
          length = 1;
        }
      }

      if (x >= 1) {
        if (cells[y][x].alive === cells[y][x - 1].alive) {
          length++;
        } else {
          aliveCells[5].push(length);
          length = 1;
        }
      }
    }
  }

  console.log(inputSave.value() + `:`, JSON.stringify(aliveCells));
  saves[inputSave.value()] = aliveCells;
  localStorage.setItem(`GOL_saves`, JSON.stringify(saves));
  inputSave.value(``);
}