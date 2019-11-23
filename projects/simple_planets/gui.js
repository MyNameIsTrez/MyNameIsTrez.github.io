const guiHeight = 100; // at the top of the screen when the cursor gets high enough
const buttonXOffset = 20;
const buttonYOffset = 20;
const buttonWidth = 150;
const buttonHeight = 50;
// const buttonEmptySpace = 30;

const buttons = {};

buttons.leftArrow = { pos: [buttonXOffset, buttonYOffset] };
buttons.rightArrow = { pos: [buttonXOffset, buttonYOffset] };

function checkMouseOverGui() {
	// mouseY is always 0 when refreshing the window
	if (mouseY <= guiHeight && mouseY !== 0) { // mouseY === 0 when you select another window
		showGui();
	}
}

function showGui() {
	noStroke();

	// show the rectangle
	const pos = buttons.leftArrow.pos;
	const x = pos[0];
	const y = pos[1];
	fill(100);
	rect(x, y, buttonWidth, buttonHeight)

	textSize(30);
	textAlign(CENTER, CENTER);
	fill(200);
	text("<", x + buttonWidth / 2, y + buttonHeight / 2);
}

function checkClickedButton() {
	getClickedButton();
}

function getClickedButton() {
	// print(mouseX, mouseY);
	// print(buttons.simplePlanets[0]);
}
