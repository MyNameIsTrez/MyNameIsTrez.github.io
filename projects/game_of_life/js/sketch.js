// Made by Sander Bos from late 2018 to early 2019 for an arcade machine, as an Informatics project for the Metis Montessori Lyceum.
// Game of Life implementation inspiration from: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life


// editable
let cellTickRate = 6; // the rate at which cells are ticked
let cellWidthCount = 24; // the amount of cells in the width
let cellHeightCount = 16; // the amount of cells in the width

let gameMode = "game_of_life"; // the game mode, game modes: game_of_life, high_life
let loopEdges = true; // whether the cells can loop around the scene at the edges
let drawGridPaused = true; // whether the grid around the cells is drawn when paused, setting this to false drastically improves performance
let drawGridPlaying = false; // whether the grid around the cells is drawn when playing, setting this to false drastically improves performance
let scene = "tutorial"; // the starting scene, default: tutorial
let emptySpace = 50;

let colors = { white: [255], black: [0], solarizedLight: [68, 90, 97], solarizedDark: "#073642", solarizedGray: "#93a1a1", orange: [255, 180, 0] };
let cellColor = colors.solarizedLight;

let strokeColor = [193];
let previousNextColor = [200]; // the color of the previous and next item
let cursorColor = [0, 127, 0];

let cursorStrokeWeight = 4;
let maxTicksColored = 8; // the amount of ticks it takes for a cell to lose it's color

const settings = ["clear cells", "loop edges: ", "draw grid paused: ", "draw grid playing: ", "game mode: ", "cell tick rate: ", "cell width count: ", "cell height count: ", "max ticks colored: ", "cell color: "];

// adds the user-made saves from the localStorage to the "saves" object
const storageSaves = JSON.parse(localStorage.getItem("GOL_saves"));
for (const save in storageSaves) {
  saves[save] = storageSaves[save];
}

// non-editable
let saveNumber = 0; // the default save that's shown in the loading scene
let settingNumber = 0; // the default setting that's shown in the settings scene
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
  background(cellColor);
  switch (scene) {
    case "tutorial":
      image(tutorialImg, 0, 0, width, height);
      break;
    case "game":
      calcGame();
      break;
    case "load":
      calcLoad();
      break;
    case "save":
      calcSave();
      break;
    case "settings":
      calcSettings();
      break;
  }
}

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});