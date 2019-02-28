// Made by Sander Bos from late 2018 to early 2019 for an arcade machine, as an Informatics project for the Metis Montessori Lyceum.
// Game of Life implementation inspiration from: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life


// editable
let cellTickRate = 6; // the rate at which cells are ticked
let cellWidthCount = 24; // the amount of cells in the width
let cellHeightCount = 16; // the amount of cells in the width

let gameMode = `game_of_life`; // the game mode, game modes: game_of_life, high_life
let loopEdges = true; // whether the cells can loop around the screen at the edges
let drawGridPaused = true; // whether the grid around the cells is drawn when paused, setting this to false drastically improves performance
let drawGridPlaying = false; // whether the grid around the cells is drawn when playing, setting this to false drastically improves performance
let screen = `tutorial`; // the starting screen, default: tutorial

let backgroundColor = [247]; // the background color
let strokeColor = [193]; // the stroke color
let previousNextColor = 200; // the color of the previous and next item
let cursorColor = [0, 127, 0]; // the cursor color
let fillColorButton = [255, 180, 0]; // the fill color for the load game and settings buttons
let maxTicksColored = 8; // the amount of ticks it takes for a cell to not be colored anymore

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

const settings = [`clear cells`, `loop edges: `, `draw grid paused: `, `draw grid playing: `, `game mode: `, `cell tick rate: `, `cell width count: `, `cell height count: `, `max ticks colored: `];

// adds the user-made saves from the localStorage to the `saves` object
const storageSaves = JSON.parse(localStorage.getItem(`GOL_saves`));
for (const save in storageSaves) {
  saves[save] = storageSaves[save];
}

// non-editable
let saveNumber = 0; // the default save that's shown in the loading screen
let settingNumber = 0; // the default setting that's shown in the settings screen
let _frameRate = 60; // the framerate of the game, always keep it at P5's default 60 FPS

var cells = [];

let
  playing = false,
  firstCellAlive,
  inputLoad,
  buttonLoad,
  inputSave,
  buttonSave,
  cursor,
  gameWidth,
  gameHeight,
  previousSaveNumber,
  nextSaveNumber,
  previousSettingNumber,
  nextSettingNumber,
  _textSize,
  rectTextSpace,
  tutorialImg;

function setup() {
  frameRate(_frameRate)
  tutorialImg = loadImage('arcade_controls.png');
  cursor = new Cursor();
  // createSaveInput();
  // createSaveButton();
  createGame();
}

function draw() {
  background(backgroundColor);
  switch (screen) {
    case `tutorial`:
      image(tutorialImg, 0, 0, width, height);
      break;
    case `game`:
      calcGame();
      break;
    case `loadGame`:
      calcLoadGame();
      break;
    case `saveGame`:
      calcSaveGame();
      break;
    case `settings`:
      calcSettings();
      break;
  }
}