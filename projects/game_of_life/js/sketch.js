// Game of Life implementation inspiration from:
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life



// editable
let cellTickRate = 6; // the rate at which cells are ticked
let cellWidthCount = 16; // the amount of cells in the width
let cellHeightCount = 16; // the amount of cells in the width

let gameMode = `game_of_life`; // the game mode, game modes: game_of_life, high_life
let loopEdges = true; // whether the cells can loop around the screen at the edges
let drawGridPaused = true; // whether the grid around the cells is drawn when paused, setting this to false drastically improves performance
let drawGridPlaying = false; // whether the grid around the cells is drawn when playing, setting this to false drastically improves performance
let screen = `game`; // the starting screen, default: game

let backgroundColor = [247]; // the background color
let strokeColor = [193]; // the stroke color
let previousNextColor = 200; // the color of the previous and next item
let cursorColor = [0, 127, 0]; // the cursor color

// name: [cellTickRate, cellWidthHeight, cellWidthCount, cellHeightCount, first cell-alive state, [length of cells with the same cell-alive states]]
const saves = {
  blinker: [3, 150, 5, 5, 0, [11, 3]],
  toad: [3, 125, 6, 6, 0, [14, 3, 2, 3]],
  beacon: [3, 125, 6, 6, 0, [7, 2, 4, 2, 6, 2, 4, 2]],
  pulsar: [3, 45, 17, 17, 0, [38, 3, 3, 3, 23, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 6, 3, 3, 3, 25, 3, 3, 3, 6, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 23, 3, 3, 3]],
  r_pentomino: [60, 8, 100, 100, 0, [4952, 2, 97, 2, 99, 1]],
  glider: [6, 80, 10, 10, 0, [13, 1, 7, 1, 1, 1, 8, 2]],
  gosper_glider_gun: [30, 16, 38, 49, 0, [63, 1, 35, 1, 1, 1, 25, 2, 6, 2, 12, 2, 13, 1, 3, 1, 4, 2, 12, 2, 2, 2, 8, 1, 5, 1, 3, 2, 16, 2, 8, 1, 3, 1, 1, 2, 4, 1, 1, 1, 23, 1, 5, 1, 7, 1, 24, 1, 3, 1, 34, 2, 117, 2, 36, 2, 376, 2, 3, 2, 70, 1, 3, 1, 34, 3, 35, 3, 114, 1, 36, 3, 34, 1, 3, 1, 35, 1, 34, 1, 5, 1, 31, 1, 5, 1, 32, 1, 3, 1, 34, 3, 339, 2, 36, 2]],
  acorn: [60, 5, 150, 150, 0, [11196, 1, 151, 1, 146, 2, 2, 3]],
  stick: [60, 5, 150, 150, 0, [11305, 8, 1, 5, 3, 3, 6, 7, 1, 5]]
}

const settings = [`clear cells`, `loop edges: `, `draw grid paused: `, `draw grid playing: `, `game mode: `, `cell tick rate: `, `cell width & height: `, `cell width count: `, `cell height count: `];

// adds the user-made saves from the localStorage to the `saves` object
const storageSaves = JSON.parse(localStorage.getItem(`GOL_saves`));
for (const save in storageSaves) {
  saves[save] = storageSaves[save];
}

// non-editable
let saveNumber = 0; // the default save that's shown in the loading screen
let settingNumber = 0; // the default setting that's shown in the settings screen
let _frameRate = 60; // the framerate of the game, always keep it at P5's default 60 FPS
let guiHeight = 100; // the height of the text at the bottom of the screen

let
  cells = [],
  playing = false,
  firstCellAlive,
  inputLoad,
  buttonLoad,
  inputSave,
  buttonSave,
  cursor,
  gameWidth,
  gameHeight,
  canvasHeight,
  previousSaveNumber,
  nextSaveNumber,
  previousSettingNumber,
  nextSettingNumber,
  _textSize,
  rectTextSpace;

function setup() {
  frameRate(_frameRate)
  cursor = new Cursor();
  // createSaveInput();
  // createSaveButton();

  cellWidthHeight = (window.innerHeight - guiHeight - 22) / cellHeightCount;
  createGame();
}

function draw() {
  background(backgroundColor);
  switch (screen) {
    case `game`:
      // limits the cells' updating speed to the cellTickRate
      if (frameCount % (_frameRate / cellTickRate) === 0) {
        for (let y in cells) {
          for (let x in cells[y]) {
            cells[y][x].getNeighbours();
          }
        }

        for (let y in cells) {
          for (let x in cells[y]) {
            cells[y][x].calculate();
          }
        }
      }

      for (let y in cells) {
        for (let x in cells[y]) {
          cells[y][x].draw();
        }
      }

      if (!playing) {
        cursor.draw();
      }

      push();
      stroke(strokeColor);
      if (!playing) {
        if (drawGridPaused) {
          for (let i = 1; i < cellWidthCount; i++) {
            line(i * cellWidthHeight, 0, i * cellWidthHeight, gameHeight);
          }

          for (let i = 1; i < cellHeightCount; i++) {
            line(0, i * cellWidthHeight, gameHeight, i * cellWidthHeight);
          }
        }
      } else {
        if (drawGridPlaying) {
          for (let i = 1; i < cellWidthCount; i++) {
            line(i * cellWidthHeight, 0, i * cellWidthHeight, gameHeight);
          }

          for (let i = 1; i < cellHeightCount; i++) {
            line(0, i * cellWidthHeight, gameHeight, i * cellWidthHeight);
          }
        }
      }
      pop();

      if (mouseIsPressed) {
        if (!playing) {
          if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
            cells[floor(mouseY / cellWidthHeight)][floor(mouseX / cellWidthHeight)].alive = firstCellAlive ? 0 : 1;
          }
        }
      }

      // create the boundary box for the grid and the `Playing: true` text
      push();
      noFill();
      stroke(strokeColor);
      rect(0, 0, gameWidth, gameHeight);
      rect(0, gameHeight, gameWidth, canvasHeight - gameHeight);
      pop();

      // create the `Playing: true` text
      push();
      textSize(_textSize * 3);
      if (playing) {
        fill(0, 191, 0);
      } else {
        fill(255, 0, 0);
      }

      text(`Playing: ` + playing, width / 2 - textWidth(`Playing: ` + playing) / 2, gameHeight + guiHeight / 2 + textSize() / 2);
      pop();
      break;
    case `loadGame`:
      if (saveNumber > 0) { // shows the previous save
        previousSaveNumber = saveNumber - 1;
      } else {
        previousSaveNumber = Object.keys(saves).length - 1;
      }
      getLoadGame(previousNextColor, _textSize * 2, previousSaveNumber, -5);

      getLoadGame(0, _textSize * 3, saveNumber, -1); // shows the currently selected save

      if (saveNumber < Object.keys(saves).length - 1) { // shows the next save
        nextSaveNumber = saveNumber + 1;
      } else {
        nextSaveNumber = 0;
      }
      getLoadGame(previousNextColor, _textSize * 2, nextSaveNumber, 2);
      break;
    case `saveGame`:
      let saveGamePlaceholderText = `WIP SAVE SCREEN`;
      push();
      textSize(_textSize);
      let x = gameWidth / 2 - (textWidth(saveGamePlaceholderText) + 2 * rectTextSpace) / 2;
      let y = canvasHeight / 2 - textSize();
      rect(x, y, textWidth(saveGamePlaceholderText) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
      text(saveGamePlaceholderText, x + rectTextSpace, y + textSize());
      pop();
      break;
    case `settings`:
      if (settingNumber > 0) { // shows the previous setting
        previousSettingNumber = settingNumber - 2;
      } else {
        previousSettingNumber = Object.keys(settings).length - 2;
      }
      getSetting(previousNextColor, _textSize, previousSettingNumber, -16);

      if (settingNumber > 0) { // shows the previous setting
        previousSettingNumber = settingNumber - 1;
      } else {
        previousSettingNumber = Object.keys(settings).length - 1;
      }
      getSetting(previousNextColor, _textSize * 2, previousSettingNumber, -5);

      getSetting(0, _textSize * 3, settingNumber, -1); // shows the currently selected setting

      if (settingNumber < Object.keys(settings).length - 1) { // shows the next setting
        nextSettingNumber = settingNumber + 1;
      } else {
        nextSettingNumber = 0;
      }
      getSetting(previousNextColor, _textSize * 2, nextSettingNumber, 2.5);

      if (settingNumber < Object.keys(settings).length - 2) { // shows the next setting
        nextSettingNumber = settingNumber + 2;
      } else {
        nextSettingNumber = 0;
      }
      getSetting(previousNextColor, _textSize, nextSettingNumber, 11);
      break;
  }
}