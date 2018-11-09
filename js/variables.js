// uneditable variables
let images = [];
let cells = [];
let previews = [];
let activePreviews = [];
let buttons = [];
let cellPurchases = 2;
let step = 0;
let previewWidth = 0;
let previewHeight = 0;
let expansionCost;

let mealsDiff = 0;
let workersDiff = 0;
let moneyDiff = 0;
let researchDiff = 0;
let energyDiff = 0;
let uraniumDiff = 0;

// editable variables
let screenW = 1280;
let screenH = 1024;
let cellWH = 64; // a cell's width and height in px
let GUIWidth = 3 * cellWH; // min recommended is 150
let cellWCount = 4; // how many cells in the width you start out with
let cellHCount = 8; // how many cells in the height you start out with
let maxCellWCount = (screenW - GUIWidth) / cellWH; // the max cells in the width
let maxCellHCount = screenH / cellWH; // the max cells in the height


let selectedWidth = 5; // the width of the selecting cursor
let selectedStrokeWeight = 2; // the stroke weight of the selection
let iconSize = 50; // should be between 25px and 100px
let previewSize = 40; // should be between 25px and 50px
let cursorSize = 1.75; // 1.75 by default, 1.5 is large and 1 is the entire cell
let fr = 60; // default and max is 60, recommended is 10
let gameSpeed = 1; // the amount of seconds that pass between every update, default of 1, min of 0.1
let cellCost = Math.pow(4, cellPurchases); // how much $ each new cell costs
let selectedBuilding = "farm"; // the default building to place
let selectedButton = "upgrades"; // the default button that's selected
let curWindow = "game"; // the window that pops up at the start of the game, "menu" or "game"
let pixelsWidePerWord = 6; // how many pixels wide each word is assumed to be on average
let maxPreviewRows = 3; // the max amount of building previews that are in each row
let maxPreviewColumns = 3; // the max amount of building previews that are in each column
let textXOffset = 10; // the x offset of the text from the left side of the canvas
let previewXOffset = 10; // the x offset of the building preview from the left side of the canvas
let previewYOffset = -55; // the y offset of the building preview from the middle of the canvas
let defaultTextSize = 12; // the default text size
let bigTextSize = 32; // the text size for big text
let buttonDataBlock = 6; // the size of a button data block
let lmbWindow = "game"; // "game", "previews" or "buttons" to be moving the cursor of

// colors of the elements
let GUIColor = [169, 206, 244]; // background color of the GUI
let buttonClr = [144, 169, 183]; // button background color
let selectedColor = [0, 200, 0]; // the selected object cursor color

// starting resources
let meals = 0;
let workers = 0;
let money = 0;
let research = 0;
let energy = 0;
let uranium = 0;


let buildings = { // name, keyCode, usage, production, available
  "farm": [
    0,
    49,
    [],
    [3],
    true
  ],
  "house": [
    1,
    50,
    [1],
    [2],
    true
  ],
  "office": [
    2,
    51,
    [5],
    [1],
    true
  ],
  "laboratory": [
    3,
    52,
    [8],
    [2],
    true
  ],
  "windmill": [
    4,
    53,
    [],
    [1],
    true
  ],
  "uranium mine": [
    5,
    54,
    [16, 2],
    [1],
    true
  ],
  "reactor": [
    6,
    55,
    [1, 1, 1],
    [20],
    false
  ],
  "empty": [
    7,
    56, , ,
    true
  ]
}


let buttonData = [
  "menu", "Menu", GUIWidth / 2 - 50, 40, 50 - 2.5, 20,
  "help", "Help", GUIWidth / 2 - 50 + 50 + 2.5, 40, 50 - 2.5, 20,
  "buy land", `Buy Land: $${expansionCost}`, GUIWidth / 2 - 50, 65, 100, 20,
  "upgrades", "Upgrades", GUIWidth / 2 - 50, 90, 100, 20,
  "stats", "Stats", GUIWidth / 2 - 50, 115, 100, 20
]