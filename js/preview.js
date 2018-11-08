class Preview {
  constructor(building, x, y) {
    this.building = building;
    this.x = x;
    this.y = y + height / 2;
  }

  draw() {
    // if the building is availabe
    if (buildings[this.building][4]) {
      if (selectedBuilding === this.building) {
        noFill();

        rect(
          this.x,
          this.y,
          previewSize,
          previewSize
        );
      }

      image(
        images[buildings[this.building][0]],
        this.x, this.y,
        previewSize,
        previewSize
      );
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
  previewRows = ceil(previews.length / maxPreviewRows);

  if (previews.length < maxPreviewColumns) {
    previewColumns = previews.length;
  } else {
    previewColumns = maxPreviewColumns;
  }

  console.log(previewRows + ", " + previewColumns);
}