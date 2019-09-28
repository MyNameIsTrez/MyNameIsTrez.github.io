function createInputs() {
  createButton('Change selection').mousePressed(function () {
    switch (selection) {
      case 'wall':
        selection = 'player';
        break;
      case 'player':
        selection = 'enemy spawnpoint';
        break;
      case 'enemy spawnpoint':
        selection = 'wall';
        break;
    }
    console.log(`Selected the ${selection} type.`);
  });

  const inputCols = createInput(cols.toString());
  inputCols.changed(inputColsChanged);

  const inputRows = createInput(rows.toString());
  inputRows.changed(inputRowsChanged);

  const inputTileSize = createInput(tileSize.toString());
  inputTileSize.changed(inputTileSizeChanged);
}

function inputColsChanged() {
  cols = parseInt(this.value());
  resize();
}

function inputRowsChanged() {
  rows = parseInt(this.value());
  resize();
}

function inputTileSizeChanged() {
  tileSize = parseInt(this.value());
  resize();
}