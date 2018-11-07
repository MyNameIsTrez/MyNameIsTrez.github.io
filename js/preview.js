class Preview {
  constructor(building, x, y) {
    this.building = building;
    this.x = x;
    this.y = y;
  }

  draw() {
    if (selectedBuilding === this.building) {
      noStroke();
      fill(selectedPreviewBgClr);
      rect(
        this.x,
        this.y + height / 2,
        previewSize,
        previewSize
      );
    }

    image(
      images[buildings[this.building][0]],
      this.x, this.y + height / 2,
      previewSize,
      previewSize
    );
  }

  clicked() {
    if (
      (mouseX > this.x) &&
      (mouseX < (this.x + previewSize)) &&
      (mouseY > (this.y + (height / 2))) &&
      (mouseY < (this.y + (previewSize + (height / 2))))
    ) {

      selectedBuilding = this.building;
    }
  }
}


function createPreviews() {
  for (let i in buildings) {
    preview = new Preview(
      i,
      GUIWidth / 2 - 65 + previewWidth * previewSize + previewWidth * 5,
      previewYOffset + previewHeight * previewSize + previewHeight * 5
    );

    previews.push(preview);
    previewWidth++;

    if (previewWidth === maxPreviewRow) {
      previewWidth = 0;
      previewHeight++;
    }
  }
}