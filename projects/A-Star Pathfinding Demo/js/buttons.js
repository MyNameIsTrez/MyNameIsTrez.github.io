function createButtons() {
  createButton('Debug').mousePressed(function () {
    debugging = !debugging;
  });
  createButton('waveActive').mousePressed(function () {
    waveActive = !waveActive;
  });
}