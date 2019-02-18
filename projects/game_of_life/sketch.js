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

function createGame() {
  playing = false;
  cells = []; // removes all cells, for when you
  // document.body.clientHeight

  gameWidth = cellWidthHeight * cellWidthCount;
  gameHeight = cellWidthHeight * cellHeightCount;
  canvasHeight = gameHeight + guiHeight;
  _textSize = gameWidth / 50;
  rectTextSpace = _textSize / 1.75;

  createCanvas(gameWidth + 1, canvasHeight + 1); // `+ 1` is needed to show the bottom and right strokes

  for (let y = 0; y < cellHeightCount; y++) {
    cells.push([]);
    for (let x = 0; x < cellWidthCount; x++) {
      cell = new Cell(x, y);
      cells[y].push(cell);
    }
  }

  cursor.x = 0;
  cursor.y = 0;

  // inputSave.position(gameWidth / 2 - inputSave.width / 2 - 83 / 2, canvasHeight + 15 + 25);
  // buttonSave.position(inputSave.x + inputSave.width + 5, inputSave.y);
}

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
      let saveGamePlaceholderText = `WIP SAVE SCREEN - Use the input field below the game to save your game for now.`;
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

function getLoadGame(loadGameStroke, loadGameTextSize, loadGameSaveNumber, heightModifier) {
  let save = Object.keys(saves)[loadGameSaveNumber];

  push();
  stroke(loadGameStroke);
  textSize(loadGameTextSize);

  let x = gameWidth / 2 - (textWidth(loadGameSaveNumber + save) + 4 * rectTextSpace) / 2;
  let y = canvasHeight / 2 + heightModifier * textSize();

  drawLoadGame(x, y, loadGameSaveNumber, save);
  pop();
}

function drawLoadGame(x, y, saveNumber, save) {
  // creates a box and draws the save name on top of it
  rect(x, y, textWidth(save) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  text(save, x + rectTextSpace, y + textSize());
}

function getSetting(settingStroke, settingTextSize, settingNumber, heightModifier) {
  let setting = settings[settingNumber];
  let info = getSettingInfo(setting);

  push();
  stroke(settingStroke);
  textSize(settingTextSize);

  let x = gameWidth / 2 - (textWidth(setting + info) + 4 * rectTextSpace) / 2;
  let y = canvasHeight / 2 + heightModifier * textSize();

  drawSetting(x, y, setting, info);
  pop();
}

function getSettingInfo(setting) {
  let info = ``;
  switch (setting) {
    case `loop edges: `:
      info = loopEdges;
      break;
    case `draw grid paused: `:
      info = drawGridPaused;
      break;
    case `draw grid playing: `:
      info = drawGridPlaying;
      break;
    case `game mode: `:
      info = gameMode;
      break;
    case `cell tick rate: `:
      info = cellTickRate;
      break;
    case `cell width & height: `:
      info = cellWidthHeight;
      break;
    case `cell width count: `:
      info = cellWidthCount;
      break;
    case `cell height count: `:
      info = cellHeightCount;
      break;
  }
  return info;
}

function drawSetting(x, y, setting, info) {
  // creates a box and draws the setting name and info on top of it
  rect(x, y, textWidth(setting + info) + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);
  text(setting + info, x + rectTextSpace, y + textSize());
}

function loadGame(saveNumber) {
  let saveName = Object.keys(saves)[saveNumber];

  cellTickRate = saves[saveName][0];
  cellWidthHeight = saves[saveName][1];
  cellWidthCount = saves[saveName][2];
  cellHeightCount = saves[saveName][3];

  createGame();

  let alive = saves[saveName][4]; // the starting cell`s alive state
  let cellX = 0;
  let cellY = 0;

  for (const size of saves[saveName][5]) {
    for (let i = 0; i < size; i++) {
      if (cellX < cellWidthCount) {
        cells[cellY][cellX++].alive = alive;
      } else {
        cellX = 0;
        cellY++;
        cells[cellY][cellX++].alive = alive;
      }
    }
    alive = !alive ? 1 : 0;
  }

  screen = `game`;
}

function saveGame() {
  if (!inputSave.value()) {
    throw `Error: You need to enter your save name!`;
  }
  if (inputSave.value() in saves) {
    throw `Error: A save with that name already exists.`;
  }

  // push the game's settings and the cell-alive state of the first cell
  let aliveCells = [];
  aliveCells.push(cellTickRate, cellWidthHeight, cellWidthCount, cellHeightCount, cells[0][0].alive, []);

  let length = 1;
  for (let y in cells) {
    for (let x in cells[y]) {
      x = int(x);
      if (x === 0 && y > 0) {
        if (cells[y][x].alive === cells[y - 1][cellWidthCount - 1].alive) {
          length++;
        } else {
          aliveCells[5].push(length);
          length = 1;
        }
      }

      if (x >= 1) {
        if (cells[y][x].alive === cells[y][x - 1].alive) {
          length++;
        } else {
          aliveCells[5].push(length);
          length = 1;
        }
      }
    }
  }

  console.log(inputSave.value() + `:`, JSON.stringify(aliveCells));
  saves[inputSave.value()] = aliveCells;
  localStorage.setItem(`GOL_saves`, JSON.stringify(saves));
  inputSave.value(``);
}

function createSaveInput() {
  // create the input field for the `Save game` button
  inputSave = createInput();
  inputSave.elt.placeholder = `Save name`
  inputSave.position(gameWidth / 2 - inputSave.width / 2 - 83 / 2, canvasHeight + 15 + 25);
}

function createSaveButton() {
  // create the `Save game` button
  buttonSave = createButton(`Save game`);
  buttonSave.position(inputSave.x + inputSave.width + 5, inputSave.y);
  buttonSave.mousePressed(saveGame);
}

class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  draw() {
    push();
    noFill();
    stroke(cursorColor);
    strokeWeight(2);
    rect(this.x, this.y, cellWidthHeight, cellWidthHeight);
    pop();
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = 0;
    this.neighbours = 0;
  }

  draw() {
    push();
    if (this.alive) {
      fill(0);
    } else {
      noFill();
    }
    noStroke();

    rect(this.x * cellWidthHeight, this.y * cellWidthHeight, cellWidthHeight, cellWidthHeight);
    pop();
  }

  getNeighbours() {
    if (playing) {
      let offsetX = 0;
      let offsetY = 0;
      this.neighbours = 0;
      // check for the surrounding neighbours
      if (loopEdges) {
        // top-left
        offsetX = 0;
        offsetY = 0;
        if (this.y === 0) {
          offsetY = cellHeightCount;
        }
        if (this.x === 0) {
          offsetX = cellWidthCount;
        }
        this.neighbours += cells[this.y - 1 + offsetY][this.x - 1 + offsetX].alive;


        // top
        offsetY = 0;
        if (this.y === 0) {
          offsetY = cellHeightCount;
        }
        this.neighbours += cells[this.y - 1 + offsetY][this.x].alive;


        // top-right
        offsetX = 0;
        offsetY = 0;
        if (this.y === 0) {
          offsetY = cellHeightCount;
        }
        if (this.x === cellWidthCount - 1) {
          offsetX = -cellWidthCount;
        }
        this.neighbours += cells[this.y - 1 + offsetY][this.x + 1 + offsetX].alive;


        // left
        offsetX = 0;
        if (this.x === 0) {
          offsetX = cellWidthCount;
        }
        this.neighbours += cells[this.y][this.x - 1 + offsetX].alive;


        // right
        offsetX = 0;
        if (this.x === cellWidthCount - 1) {
          offsetX = -cellWidthCount;
        }
        this.neighbours += cells[this.y][this.x + 1 + offsetX].alive;


        // bottom-left
        offsetX = 0;
        offsetY = 0;
        if (this.y === cellHeightCount - 1) {
          offsetY = -cellHeightCount;
        }
        if (this.x === 0) {
          offsetX = cellWidthCount;
        }
        this.neighbours += cells[this.y + 1 + offsetY][this.x - 1 + offsetX].alive;


        // bottom
        offsetY = 0;
        if (this.y === cellHeightCount - 1) {
          offsetY = -cellHeightCount;
        }
        this.neighbours += cells[this.y + 1 + offsetY][this.x].alive;


        // bottom-right
        offsetX = 0;
        offsetY = 0;
        if (this.y === cellHeightCount - 1) {
          offsetY = -cellHeightCount;
        }
        if (this.x === cellWidthCount - 1) {
          offsetX = -cellWidthCount;
        }
        this.neighbours += cells[this.y + 1 + offsetY][this.x + 1 + offsetX].alive;


      } else {


        // top-left
        if (this.y > 0 && this.x > 0) {
          this.neighbours += cells[this.y - 1][this.x - 1].alive;
        }
        // top
        if (this.y > 0) {
          this.neighbours += cells[this.y - 1][this.x].alive;
        }
        // top-right
        if (this.y > 0 && this.x < cellWidthCount - 1) {
          this.neighbours += cells[this.y - 1][this.x + 1].alive;
        }

        // left
        if (this.x > 0) {
          this.neighbours += cells[this.y][this.x - 1].alive;
        }
        // right
        if (this.x < cellWidthCount - 1) {
          this.neighbours += cells[this.y][this.x + 1].alive;
        }

        // bottom-left
        if (this.y < cellHeightCount - 1 && this.x > 0) {
          this.neighbours += cells[this.y + 1][this.x - 1].alive;
        }
        // bottom
        if (this.y < cellHeightCount - 1) {
          this.neighbours += cells[this.y + 1][this.x].alive;
        }
        // bottom-right
        if (this.y < cellHeightCount - 1 && this.x < cellWidthCount - 1) {
          this.neighbours += cells[this.y + 1][this.x + 1].alive;
        }
      }
    }
  }

  calculate() {
    if (playing) {
      switch (this.neighbours) {
        case 2:
          break;
        case 3:
          if (!this.alive) {
            this.alive = 1;
          }
          break;
        case 6:
          if (gameMode === `high_life`) {
            if (!this.alive) {
              this.alive = 1;
            }
          } else {
            this.alive = 0;
          }
          break;
        default:
          this.alive = 0;
          break;
      }
    }
  }
  clicked() { }
}

function up() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.y > 0) {
          cursor.y -= cellWidthHeight;
        }
      }
      break;
    case `loadGame`:
      if (saveNumber > 0) {
        saveNumber--;
      } else {
        saveNumber = Object.keys(saves).length - 1;
      }
      break;
    case `settings`:
      if (settingNumber > 0) {
        settingNumber--;
      } else {
        settingNumber = settings.length - 1;
      }
      break;
  }
}

function down() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.y < gameHeight - cellWidthHeight) {
          cursor.y += cellWidthHeight;
        }
      }
      break;
    case `loadGame`:
      if (saveNumber < Object.keys(saves).length - 1) {
        saveNumber++;
      } else {
        saveNumber = 0;
      }
      break;
    case `settings`:
      if (settingNumber < settings.length - 1) {
        settingNumber++;
      } else {
        settingNumber = 0;
      }
      break;
  }
}

function left() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.x > 0) {
          cursor.x -= cellWidthHeight;
        }
      }
      break;
    case `settings`:
      switch (settings[settingNumber]) {
        case `loop edges: `:
          loopEdges = !loopEdges;
          break;
        case `draw grid paused: `:
          drawGridPaused = !drawGridPaused;
          break;
        case `draw grid playing: `:
          drawGridPlaying = !drawGridPlaying;
          break;
        case `game mode: `:
          switch (gameMode) {
            case `game_of_life`:
              gameMode = `high_life`;
              break;
            case `high_life`:
              gameMode = `game_of_life`;
              break;
          }
          break;
        case `cell tick rate: `:
          switch (cellTickRate) {
            case 60:
              cellTickRate = 30;
              break;
            case 30:
              cellTickRate = 15;
              break;
            case 15:
              cellTickRate = 6;
              break;
            case 6:
              cellTickRate = 3;
              break;
            case 3:
              cellTickRate = 1;
              break;
            case 1:
              cellTickRate = 60;
              break;
          }
          break;
        case `cell width & height: `:
          switch (cellWidthHeight) {
            case 150:
              cellWidthHeight = 125;
              break;
            case 125:
              cellWidthHeight = 80;
              break;
            case 80:
              cellWidthHeight = 45;
              break;
            case 45:
              cellWidthHeight = 16;
              break;
            case 16:
              cellWidthHeight = 8;
              break;
            case 8:
              cellWidthHeight = 150;
              break;
            default:
              cellWidthHeight = 45;
              break;
          }
          createGame();
          break;
        case `cell width count: `:
          switch (cellWidthCount) {
            case 150:
              cellWidthCount = 100;
              break;
            case 100:
              cellWidthCount = 49;
              break;
            case 49:
              cellWidthCount = 38;
              break;
            case 38:
              cellWidthCount = 17;
              break;
            case 17:
              cellWidthCount = 16;
              break;
            case 16:
              cellWidthCount = 10;
              break;
            case 10:
              cellWidthCount = 6;
              break;
            case 6:
              cellWidthCount = 5;
              break;
            case 5:
              cellWidthCount = 150;
              break;
          }
          createGame();
          break;
        case `cell height count: `:
          switch (cellHeightCount) {
            case 150:
              cellHeightCount = 100;
              break;
            case 100:
              cellHeightCount = 49;
              break;
            case 49:
              cellHeightCount = 38;
              break;
            case 38:
              cellHeightCount = 17;
              break;
            case 17:
              cellHeightCount = 16;
              break;
            case 16:
              cellHeightCount = 10;
              break;
            case 10:
              cellHeightCount = 6;
              break;
            case 6:
              cellHeightCount = 5;
              break;
            case 5:
              cellHeightCount = 150;
              break;
          }
          createGame();
          break;
      }
      break;
  }
}

function right() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.x < gameWidth - cellWidthHeight) {
          cursor.x += cellWidthHeight;
        }
      }
      break;
    case `settings`:
      switch (settings[settingNumber]) {
        case `loop edges: `:
          loopEdges = !loopEdges;
          break;
        case `draw grid paused: `:
          drawGridPaused = !drawGridPaused;
          break;
        case `draw grid playing: `:
          drawGridPlaying = !drawGridPlaying;
          break;
        case `game mode: `:
          switch (gameMode) {
            case `game_of_life`:
              gameMode = `high_life`;
              break;
            case `high_life`:
              gameMode = `game_of_life`;
              break;
          }
          break;
        case `cell tick rate: `:
          switch (cellTickRate) {
            case 1:
              cellTickRate = 3;
              break;
            case 3:
              cellTickRate = 6;
              break;
            case 6:
              cellTickRate = 15;
              break;
            case 15:
              cellTickRate = 30;
              break;
            case 30:
              cellTickRate = 60;
              break;
            case 60:
              cellTickRate = 1;
              break;
          }
          break;
        case `cell width & height: `:
          switch (cellWidthHeight) {
            case 8:
              cellWidthHeight = 16;
              break;
            case 16:
              cellWidthHeight = 45;
              break;
            case 45:
              cellWidthHeight = 80;
              break;
            case 80:
              cellWidthHeight = 125;
              break;
            case 125:
              cellWidthHeight = 150;
              break;
            case 150:
              cellWidthHeight = 8;
              break;
            default:
              cellWidthHeight = 45;
              break;
          }
          createGame();
          break;
        case `cell width count: `:
          switch (cellWidthCount) {
            case 5:
              cellWidthCount = 6;
              break;
            case 6:
              cellWidthCount = 10;
              break;
            case 10:
              cellWidthCount = 16;
              break;
            case 16:
              cellWidthCount = 17;
              break;
            case 17:
              cellWidthCount = 38;
              break;
            case 38:
              cellWidthCount = 49;
              break;
            case 49:
              cellWidthCount = 100;
              break;
            case 100:
              cellWidthCount = 150;
              break;
            case 150:
              cellWidthCount = 5;
              break;
          }
          createGame();
          break;
        case `cell height count: `:
          switch (cellHeightCount) {
            case 5:
              cellHeightCount = 6;
              break;
            case 6:
              cellHeightCount = 10;
              break;
            case 10:
              cellHeightCount = 16;
              break;
            case 16:
              cellHeightCount = 17;
              break;
            case 17:
              cellHeightCount = 38;
              break;
            case 38:
              cellHeightCount = 49;
              break;
            case 49:
              cellHeightCount = 100;
              break;
            case 100:
              cellHeightCount = 150;
              break;
            case 150:
              cellHeightCount = 5;
              break;
          }
          createGame();
          break;
      }
      break;
  }
}

function click() {
  switch (screen) {
    case `game`:
      if (!playing) {
        let cell = cells[floor(cursor.y / cellWidthHeight)][floor(cursor.x / cellWidthHeight)];
        if (!cell.alive) {
          cell.alive = 1;
        } else {
          cell.alive = 0;
        }
      }
      break;
    case `loadGame`:
      loadGame(saveNumber);
      screen = `game`;
      break;
    case `settings`:
      switch (settings[settingNumber]) {
        case `clear cells`:
          createGame();
          screen = `game`;
          break;
      }
      break;
  }
}

function pausePlay() {
  if (screen === `game`) {
    if (playing) {
      playing = false;
    } else {
      playing = true;
    }
  }
}

function loadGameScreen() {
  if (screen === `loadGame`) {
    screen = `game`;
  } else {
    screen = `loadGame`;
  }
}

function settingsScreen() {
  if (screen === `settings`) {
    screen = `game`;
  } else {
    screen = `settings`;
  }
}

function saveGameScreen() {
  if (screen === `saveGame`) {
    screen = `game`;
  } else {
    screen = `saveGame`;
  }
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW: // up
      up()
      break;
    case DOWN_ARROW: // down
      down()
      break;
    case LEFT_ARROW: // left
      left()
      break;
    case RIGHT_ARROW: // right
      right()
      break;

    case 89: //y, click
      click();
      break;

    case 87: // w, pause/play
      pausePlay();
      break;

    case 65: // a, open the load screen
      loadGameScreen();
      break;

    case 83: // s, open the settings screen
      settingsScreen();
      break;

    // case 68: // d, open the save screen
    //   saveGameScreen();
    //   break;
  }
}

function mousePressed() {
  if (!playing) {
    if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
      firstCellAlive = cells[floor(mouseY / cellWidthHeight)][floor(mouseX / cellWidthHeight)].alive;
    }
  }
}

window.addEventListener(`contextmenu`, (e) => {
  e.preventDefault();
});