function createButtons() {
  createButton('Debug').mousePressed(function () {
    debugging = !debugging;
  });
  // createButton('waveActive').mousePressed(function () {
  //   waveActive = !waveActive;
  // });
  createButton('Sliding enemies').mousePressed(function () {
    slidingEnemies = !slidingEnemies;
  });
  createButton('Diagonal Neighbors').mousePressed(function () {
    diagonalNeighbors = !diagonalNeighbors;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        world[col][row].addNeighbors();
      }
    }

    for (const enemy of enemies) {
      enemy.pathfind(tileContainsPlayer);
    }
  });
  createButton('Show sets').mousePressed(function () {
    showSets = !showSets;
  });
  createButton('Show path').mousePressed(function () {
    showPath = !showPath;
  });
}