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
      50,
      50 + this.previewHUpgrades * iconSize
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