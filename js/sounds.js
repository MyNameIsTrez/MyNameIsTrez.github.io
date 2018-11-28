let gridSound = new Audio('sounds/grid/grid.mp3');
let GUISound = new Audio('sounds/gui/gui.mp3');
let purchaseSound = new Audio('sounds/purchase/purchase.mp3');
let removeBuildingsSound = new Audio('sounds/remove_buildings/remove_buildings.mp3');

function playSoundGrid() {
  gridSound.currentTime = 0;
  gridSound.play();
}

function playSoundGUI() {
  GUISound.currentTime = 0;
  GUISound.play();
}

function playSoundPurchase() {
  purchaseSound.currentTime = 0;
  purchaseSound.play();
}

function playSoundRemoveBuildings() {
  removeBuildingsSound.currentTime = 0;
  removeBuildingsSound.play();
}