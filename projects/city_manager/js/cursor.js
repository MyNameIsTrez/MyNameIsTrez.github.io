class Cursor {
  constructor() {
    this.gameX = GUIW;
    this.gameY = 0;
  }

  draw() {
    switch (curWindow) {
      case 'game':
        switch (lmbWindow) {
          case 'grid':
            // draws the green around the cell
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
          case 'previews':
            // draws the green around the preview
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
          case 'buttons':
            // draws the small green rectangle on the left of the button
            for (var i = 0; i < buttons.game.length; i++) {
              if (selectedButton.game === buttons.game[i].building) {
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
      case 'upgrades':
        // draws the small green rectangle on the left of the button
        for (var i = 0; i < buttons.upgrades.length; i++) {
          if (selectedButton.upgrades === buttons.upgrades[i].building) {
            noFill();
            stroke(selectedColor);
            strokeWeight(selectedStrokeWeight);

            rect(
              buttons.upgrades[i].x,
              buttons.upgrades[i].y,
              buttons.upgrades[i].w,
              buttons.upgrades[i].h
            );
          }
        }
        break;
    }
  }
}