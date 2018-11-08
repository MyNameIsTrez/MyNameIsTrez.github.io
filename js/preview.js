class Preview {
  constructor(building, x, y) {
    this.building = building;
    this.x = x;
    this.y = y + height / 2;
  }

  draw() {
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