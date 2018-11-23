class Cursor {
  constructor() {
    this.gameX = GUIW;
    this.gameY = 0;
  }

  draw() {
    switch (curWindow) {
      case "game":
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
            for (var i = 0; i < previews.game.length; i++) {
              if (selectedBuilding === previews.game[i].building) {
                noFill();
                stroke(selectedColor);
                strokeWeight(selectedStrokeWeight);

                rect(
                  previews.game[i].x,
                  previews.game[i].y,
                  previewSize,
                  previewSize
                );
              }
            }
            break;
          case "buttons":
            for (var i = 0; i < buttons.game.length; i++) {
              if (selectedButton === buttons.game[i].building) {
                fill(selectedColor);
                stroke(0);

                rect(
                  buttons.game[i].x,
                  height - buttons.game[i].y,
                  selectedW,
                  buttons.game[i].h
                );
              }
            }
            break;
        }
        break;
      case "upgrades":
        for (var i = 0; i < buttons.upgrades.length; i++) {
          if (selectedBuilding === buttons.upgrades[i].building) {
            noFill();
            stroke(selectedColor);
            strokeWeight(selectedStrokeWeight);

            rect(
              buttons.upgrades[i].x,
              buttons.upgrades[i].y,
              previewSize,
              previewSize
            );
          }
        }
        break;
    }
  }
}