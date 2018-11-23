class Preview {
  constructor(building, x, y) {
    this.building = building;
    this.x = x;
    this.y = y;
  }

  draw() {
    // if the building is availabe
    if (buildings[this.building][4]) {
      if (curWindow === 'game') {
        if (selectedBuilding === this.building) {
          noFill();
          rect(
            this.x,
            this.y,
            previewSize,
            previewSize
          );
        }
      }

      // if the building isn't 'empty' and the curWindow isn't 'upgrades' at the same time
      if (!(this.building === 'empty' && curWindow === 'upgrades')) {
        image(
          images[buildings[this.building][0]],
          this.x, this.y,
          previewSize,
          previewSize
        );
      }
    }
  }

  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + previewSize)) &&
      (mouseY > (this.y)) &&
      (mouseY < (this.y + (previewSize)))
    ) {
      selectedBuilding = this.building;
    }
  }
}

function getPreviewRowsAndColumns() {
  previewRows = ceil(activePreviews.length / maxPreviewRows);
  if (activePreviews.length < maxPreviewColumns) {
    previewColumns = activePreviews.length;
  } else {
    previewColumns = maxPreviewColumns;
  }
}

function getActivePreviews() {
  activePreviews = [];
  for (key in buildings) {
    // if the building is availabe
    if (buildings[key][4]) {
      activePreviews.push(key);
    }
  }
}