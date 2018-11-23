// uneditable variables
let images = [];
let cells = [];
let previews = { game: [], upgrades: [] };
let activePreviews = [];
let buttons = { game: [], upgrades: [] };
let cellPurchases = 2;
let step = 0;
let previewW = 0;
let previewH = 0;
let expansionCost;
let cellWCount = 4; // the amount of cells in the width
let cellHCount = 8; // the amount of cells in the height

let mealsDiff = 0;
let workersDiff = 0;
let moneyDiff = 0;
let researchDiff = 0;
let energyDiff = 0;
let uraniumDiff = 0;

// editable variables
const screenW = 1280;
const screenH = 1024;
const cellWH = 64; // a cell's width and height in px
const GUIW = 3 * cellWH; // min recommended is 150
const cellCost = Math.pow(4, cellPurchases); // how much $ each new cell costs
const upgradesWH = 500; // the width of the upgrades canvas
const maxCellWCount = (screenW - GUIW) / cellWH; // the max cells in the width
const maxCellHCount = screenH / cellWH; // the max cells in the height
const selectedW = 5; // the width of the selecting cursor
const selectedStrokeWeight = 2; // the stroke weight of the selection
const iconSize = 50; // should be between 25px and 100px
const previewSize = 40; // should be between 25px and 50px
const _frameRate = 60; // default and max is 60, recommended is 10
const gameSpeed = 1; // the amount of seconds that pass between every update, default of 1, min of 0.1
const defaultTextSize = 12; // the default text size
const bigTextSize = 32; // the text size for big text
const pxWNormalLetter = 6; // how many pixels wide each word is assumed to be on average
const pxWBigLetter = 16; // how many pixels wide each word is assumed to be on average
const maxPreviewRows = 3; // the max amount of building previews that are in each row
const maxPreviewColumns = 3; // the max amount of building previews that are in each column
const previewYOffset = -55; // the y offset of the building preview from the middle of the canvas
const buttonDataBlock = 7; // the size of a button data block
const buttonWGame = GUIW / 2 - 50 // the width of the button in the game window
const buttonHGame = 20; // the height of the button in the game window
const upgradesW = 100; // the amount of px the upgrades are from the names on the left
const upgradesH = 50; // the amount of px the upgrades are from the names on the left

// colors of the elements
const GUIColor = [169, 206, 244]; // background color of the GUI
const buttonClr = [144, 169, 183]; // button background color
const selectedColor = [0, 200, 0]; // the selected object cursor color

let selectedBuilding = "farm"; // the default building to place
let selectedButton = "buy land"; // the default button that's selected
let curWindow = "game"; // the window that pops up at the start of the game, "menu" or "game"
let lmbWindow = "game"; // "game", "previews" or "buttons" to be moving the cursor of

// starting resources
let meals = 0;
let workers = 0;
let money = 1000000;
let research = 0;
let energy = 0;
let uranium = 0;


let buildings = { // name: number, keyCode, usage, production, available
  farm: [
    0,
    49, ,
    [3],
    true
  ],
  house: [
    1,
    50,
    [1],
    [2],
    true
  ],
  office: [
    2,
    51,
    [5],
    [1],
    true
  ],
  laboratory: [
    3,
    52,
    [8],
    [2],
    true
  ],
  windmill: [
    4,
    53, ,
    [1],
    true
  ],
  uranium_mine: [
    5,
    54,
    [16, 2],
    [1],
    true
  ],
  reactor: [
    6,
    55,
    [1, 1, 1],
    [20],
    true
  ],
  empty: [
    7,
    56, , ,
    true
  ]
}


let upgrades = { // name: multiplier, addition
  farm: [
    3, 5
  ],
  house: [
    3
  ],
  office: [
    3
  ],
  laboratory: [
    3
  ],
  windmill: [
    3
  ],
  uranium_mine: [
    3
  ],
  reactor: [
    3
  ],
}


let buttonData = {
  // name, drawText, pxWPerLetter, x, y, w, h
  game: [
    "menu", "Menu", pxWNormalLetter, buttonWGame, 40, 50 - 2.5, buttonHGame,
    "help", "Help", pxWNormalLetter, buttonWGame + 50 + 2.5, 40, 50 - 2.5, buttonHGame,
    "buy land", `Buy Land: $${expansionCost}`, pxWNormalLetter, buttonWGame, 65, 100, buttonHGame,
    "upgrades", "Upgrades", pxWNormalLetter, buttonWGame, 90, 100, buttonHGame,
    "stats", "Stats", pxWNormalLetter, buttonWGame, 115, 100, buttonHGame
  ],

  upgrades: [
    "farm", `${upgrades["farm"][0]}x`, pxWBigLetter, upgradesW, upgradesH * 1, iconSize, iconSize,
    "house", `${upgrades["house"][0]}x`, pxWBigLetter, upgradesW, upgradesH * 2, iconSize, iconSize,
    "office", `${upgrades["office"][0]}x`, pxWBigLetter, upgradesW, upgradesH * 3, iconSize, iconSize,
    "laboratory", `${upgrades["laboratory"][0]}x`, pxWBigLetter, upgradesW, upgradesH * 4, iconSize, iconSize,
    "windmill", `${upgrades["windmill"][0]}x`, pxWBigLetter, upgradesW, upgradesH * 5, iconSize, iconSize,
    "uranium_mine", `${upgrades["uranium_mine"][0]}x`, pxWBigLetter, upgradesW, upgradesH * 6, iconSize, iconSize,
    "reactor", `${upgrades["reactor"][0]}x`, pxWBigLetter, upgradesW, upgradesH * 7, iconSize, iconSize
  ]
}