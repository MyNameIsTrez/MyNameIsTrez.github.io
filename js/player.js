class Player {
  constructor() {
    this.gameX = GUIWidth;
    this.gameY = 0;
  }

  draw() {
    switch (lmbWindow) {
      case "game":
        fill(selectedColor);
        stroke(0);

        rect(
          this.gameX,
          this.gameY,
          selectedWidth,
          cellWH
        );
        break;
      case "previews":
        for (var i = 0; i < Object.keys(buildings).length; i++) {
          if (selectedBuilding === previews[i].building) {
            fill(selectedColor);
            stroke(0);

            rect(
              previews[i].x,
              previews[i].y,
              selectedWidth,
              previewSize
            );
          }
        }
        break;
      case "buttons":
        for (var i = 0; i < Object.keys(buttons).length; i++) {
          if (selectedButton === buttons[i].type) {
            fill(selectedColor);
            stroke(0);

            rect(
              buttons[i].x,
              buttons[i].y,
              selectedWidth,
              buttons[i].h
            );
          }
        }
        break;
    }
  }
}
