class Cursor {
  constructor() {
    this.gameX = GUIWidth;
    this.gameY = 0;
  }

  draw() {
    switch (lmbWindow) {
      case "game":
        noFill();
        stroke(selectedColor);
        strokeWeight(selectedStrokeWeight);

        rect(
          this.gameX,
          this.gameY,
          cellWH,
          cellWH
        );
        break;
      case "previews":
        for (var i = 0; i < previews.length; i++) {
          if (selectedBuilding === previews[i].building) {
            noFill();
            stroke(selectedColor);
            strokeWeight(selectedStrokeWeight);

            rect(
              previews[i].x,
              previews[i].y,
              previewSize,
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