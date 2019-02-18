// uneditable variables
let images = { buildings: [], sound: [] };
let cells = [];
let previews = { game: [], upgrades: [] };
let activePreviews = [];
let buttons = { game: [], upgrades: [], /*settings: [],*/ misc: [] };
let cellPurchases = 2;
let step = 0;
let previewW = 0;
let previewH = 0;
let expansionCost;
let interactedWithPage = false;

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
const maxCellWCount = (screenW - GUIW) / cellWH; // the max cells in the width
const maxCellHCount = screenH / cellWH; // the max cells in the height
const selectedW = 5; // the width of the selecting cursor
const selectedStrokeWeight = 2; // the stroke weight of the selection
const iconSize = 50; // should be between 25px and 100px
const previewSize = 40; // should be between 25px and 50px
const _frameRate = 60; // default and max is 60, recommended is 10
const gameSpeed = 1; // the amount of seconds that pass between every update, default of 1, min of 0.1
const normalTextSize = 12; // the default text size
const bigTextSize = 32; // the text size for big text
const pxWNormalLetter = 6; // how many pixels wide each word is assumed to be on average
const pxWBigLetter = 16; // how many pixels wide each word is assumed to be on average
const maxPreviewRows = 3; // the max amount of building previews that are in each row
const maxPreviewColumns = 3; // the max amount of building previews that are in each column
const previewYOffset = -55; // the y offset of the building preview from the middle of the canvas
const buttonDataBlock = 7; // the size of a button data block
const buttonXGame = GUIW / 2 - 60 // the width of the button in the game window
const buttonHGame = 20; // the height of the button in the game window
const canvasWHUpgrades = 500; // the width of the upgrades canvas
const upgradesW = canvasWHUpgrades / 2; // the amount of px the upgrade buttons are in their width
const upgradesH = iconSize; // the amount of px the upgrades are in the height

// colors of the elements
const GUIColor = [169, 206, 244]; // background color of the GUI
const buttonClr = [144, 169, 183]; // button background color
const selectedColor = [0, 200, 0]; // the cursor color around the selected object

let curWindow = 'game'; // the window that pops up at the start of the game: 'game', 'upgrades', 'help'...
let lastWindow; // the window you had open before the current one
let lmbWindow = 'grid'; // 'grid', 'previews' or 'buttons' to be moving the cursor of
let cellWCount = 4; // the amount of cells in the width
let cellHCount = 8; // the amount of cells in the height
let selectedButton = { game: 'buy_land', upgrades: 'farm_1' }
let selectedBuilding = 'farm' // the default building to place

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


let buttonData = {
  // name, drawText, pxWPerLetter, x, y, w, h

  game: [
    'menu', 'Menu', pxWNormalLetter, buttonXGame, 40, 57.5, buttonHGame,
    'help', 'Help', pxWNormalLetter, buttonXGame + 62.5, 40, 57.5, buttonHGame,
    'buy_land', `Buy Land: $${expansionCost}`, pxWNormalLetter, buttonXGame, 65, 120, buttonHGame,
    'upgrades', 'Upgrades', pxWNormalLetter, buttonXGame, 90, 120, buttonHGame,
    // 'settings', 'Settings', pxWNormalLetter, buttonXGame, 115, 120, buttonHGame,
    'remove_buildings', 'Remove buildings', pxWNormalLetter, buttonXGame, 115, 120, buttonHGame
  ],

  upgrades: [
    // level 2
    'farm_1', `${upgrades['farm'][1][2]}x`, pxWBigLetter, upgradesW, upgradesH * 1, iconSize, iconSize,
    'house_1', `${upgrades['house'][1][2]}x`, pxWBigLetter, upgradesW, upgradesH * 2 + 10, iconSize, iconSize,
    'office_1', `${upgrades['office'][1][2]}x`, pxWBigLetter, upgradesW, upgradesH * 3 + 20, iconSize, iconSize,
    'laboratory_1', `${upgrades['laboratory'][1][2]}x`, pxWBigLetter, upgradesW, upgradesH * 4 + 30, iconSize, iconSize,
    'windmill_1', `${upgrades['windmill'][1][2]}x`, pxWBigLetter, upgradesW, upgradesH * 5 + 40, iconSize, iconSize,
    'uranium_mine_1', `${upgrades['uranium_mine'][1][2]}x`, pxWBigLetter, upgradesW, upgradesH * 6 + 50, iconSize, iconSize,
    'reactor_1', `${upgrades['reactor'][1][2]}x`, pxWBigLetter, upgradesW, upgradesH * 7 + 60, iconSize, iconSize,

    // level 3
    'farm_2', `${upgrades['farm'][2][2]}x`, pxWBigLetter, upgradesW, upgradesH * 1, iconSize, iconSize,
    'house_2', `${upgrades['house'][2][2]}x`, pxWBigLetter, upgradesW, upgradesH * 2 + 10, iconSize, iconSize,
    'office_2', `${upgrades['office'][2][2]}x`, pxWBigLetter, upgradesW, upgradesH * 3 + 20, iconSize, iconSize,
    'laboratory_2', `${upgrades['laboratory'][2][2]}x`, pxWBigLetter, upgradesW, upgradesH * 4 + 30, iconSize, iconSize,
    'windmill_2', `${upgrades['windmill'][2][2]}x`, pxWBigLetter, upgradesW, upgradesH * 5 + 40, iconSize, iconSize,
    'uranium_mine_2', `${upgrades['uranium_mine'][2][2]}x`, pxWBigLetter, upgradesW, upgradesH * 6 + 50, iconSize, iconSize,
    'reactor_2', `${upgrades['reactor'][2][2]}x`, pxWBigLetter, upgradesW, upgradesH * 7 + 60, iconSize, iconSize,

    // level 4
    'farm_3', `${upgrades['farm'][3][2]}x`, pxWBigLetter, upgradesW, upgradesH * 1, iconSize, iconSize,
    'house_3', `${upgrades['house'][3][2]}x`, pxWBigLetter, upgradesW, upgradesH * 2 + 10, iconSize, iconSize,
    'office_3', `${upgrades['office'][3][2]}x`, pxWBigLetter, upgradesW, upgradesH * 3 + 20, iconSize, iconSize,
    'laboratory_3', `${upgrades['laboratory'][3][2]}x`, pxWBigLetter, upgradesW, upgradesH * 4 + 30, iconSize, iconSize,
    'windmill_3', `${upgrades['windmill'][3][2]}x`, pxWBigLetter, upgradesW, upgradesH * 5 + 40, iconSize, iconSize,
    'uranium_mine_3', `${upgrades['uranium_mine'][3][2]}x`, pxWBigLetter, upgradesW, upgradesH * 6 + 50, iconSize, iconSize,
    'reactor_3', `${upgrades['reactor'][3][2]}x`, pxWBigLetter, upgradesW, upgradesH * 7 + 60, iconSize, iconSize
  ],

  // settings: [
  //   'stats', 'Stats', pxWBigLetter, 150, 100, 200, 50
  // ],

  // the miscellaneous buttons
  misc: [
    'back', 'Back', pxWBigLetter, 0, 0, iconSize * 2, iconSize
  ]
}