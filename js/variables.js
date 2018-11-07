// uneditable variables
let images = [];
let cells = [];
let previews = [];
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
let cellWH = 75; // a cell's width and height in px
let cellWCount = 4; // how many cells in the width you start out with
let cellHCount = 8; // how many cells in the height you start out with
let iconSize = 50; // should be between 25px and 100px
let previewSize = 40; // should be between 25px and 50px
let GUIWidth = 150; // min recommended is 150
let playerSize = 1.75; // 1.75 by default, 1.5 is large and 1 is the entire cell
let fr = 60; // default and max is 60, recommended is 10
let gameSpeed = 1; // the amount of seconds that pass between every update, default of 1, min of 0.1
let cellCost = Math.pow(4, cellPurchases); // how much $ each new cell costs
let selectedBuilding = "farm"; // the default building to place
let selectedButton = "upgrades"; // the default button that's selected
let curWindow = "game"; // the window that pops up at the start of the game, "menu" or "game"
let pixelsWidePerWord = 6; // how many pixels wide each word is assumed to be on average
let maxPreviewRow = 3; // the max amount of building previews that are in each row
let maxPreviewColumn = 3; // the max amount of building previews that are in each column
let textXOffset = 10; // the x offset of the text from the left side of the canvas
let previewXOffset = 10; // the x offset of the building preview from the left side of the canvas
let previewYOffset = -55; // the y offset of the building preview from the middle of the canvas
let defaultTextSize = 12; // the default text size
let bigTextSize = 32; // the text size for big text
let buttonDataBlock = 6; // the size of a button data block
let lmbWindow = "game"; // "building" or "selecting" with the arrows/wasd

// colors of the elements
let GUIColor = [169, 206, 244]; // background color of the GUI
let selectedPreviewBgClr = [0, 255, 0, 100]; // selected preview background color
let buttonClr = [144, 169, 183]; // button background color

// starting resources
let meals = 0;
let workers = 0;
let money = 200;
let research = 0;
let energy = 0;
let uranium = 0;


let buildings = { // name, keyCode
  "farm": [0, 49],
  "house": [1, 50],
  "office": [2, 51],
  "laboratory": [3, 52],
  "windmill": [4, 53],
  "uranium mine": [5, 54],
  "reactor": [6, 55],
  "empty": [7, 192]
}


let buttonData = [
  "menu", "Menu", GUIWidth / 2 - 50, 40, 50 - 2.5, 20,
  "help", "Help", GUIWidth / 2 - 50 + 50 + 2.5, 40, 50 - 2.5, 20,
  "buy land", `Buy Land: $${expansionCost}`, GUIWidth / 2 - 50, 65, 100, 20,
  "upgrades", "Upgrades", GUIWidth / 2 - 50, 90, 100, 20,
  "stats", "Stats", GUIWidth / 2 - 50, 115, 100, 20
]