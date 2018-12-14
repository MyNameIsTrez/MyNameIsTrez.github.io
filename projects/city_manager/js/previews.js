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
          images.buildings[buildings[this.building][0]],
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
      // only set selectedBuilding if it's different
      if (selectedBuilding !== this.building) {
        playSoundGUI();
        selectedBuilding = this.building;
      }
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

previewData = {
  'previewWGame': 0,
  'previewHGame': 0,
  'previewHUpgrades': 0,

  get game() {
    return [
      GUIW / 2 - 65 + this.previewWGame * previewSize + this.previewWGame * 5,
      previewYOffset + this.previewHGame * previewSize + this.previewHGame * 5 + height / 2
    ];
  },

  get upgrades() {
    return [
      canvasWHUpgrades / 2 - iconSize,
      iconSize + this.previewHUpgrades * iconSize + this.previewHUpgrades * 10 + 5
    ];
  }
}

function createPreviews() {
  previews = { game: [], upgrades: [] };

  for (const building in buildings) {
    // if the building is availabe
    if (buildings[building][4]) {
      // for the game window
      preview = new Preview(
        building,
        previewData.game[0],
        previewData.game[1]
      );

      previews.game.push(preview);
      previewData.previewWGame++;

      if (previewData.previewWGame === maxPreviewRows) {
        previewData.previewWGame = 0;
        previewData.previewHGame++;
      }

      // for the upgrades window
      preview = new Preview(
        building,
        previewData.upgrades[0],
        previewData.upgrades[1]
      );

      previews.upgrades.push(preview);
      previewData.previewHUpgrades++;
    }
  }
  previewData.previewWGame = 0;
  previewData.previewHGame = 0;
  previewData.previewHUpgrades = 0;
}