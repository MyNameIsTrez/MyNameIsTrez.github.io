const guiHeight = 100; // at the top of the screen when the cursor gets high enough
const buttonXOffset = 20;
const buttonYOffset = 20;
const buttonWidth = 150;
const buttonHeight = 50;
// const buttonEmptySpace = 30;

const buttons = {};

buttons.springs = { pos: [buttonXOffset, buttonYOffset] };
buttons.planets = { pos: [buttonXOffset, buttonYOffset] };

function checkMouseOverGui() {
	// mouseY is always 0 when refreshing the window
	if (mouseY <= guiHeight && mouseY !== 0) {
		drawGui();
	}
}

function drawGui() {
	noStroke();

	// draw the rectangle
	const pos = buttons.springs.pos;
	const x = pos[0];
	const y = pos[1];
	fill(100);
	rect(x, y, buttonWidth, buttonHeight)

	textSize(30);
	textAlign(CENTER, CENTER);
	fill(200);
	text("Springs", x + buttonWidth / 2, y + buttonHeight / 2);
}

function checkClickedButton() {
	getClickedButton();
}

function getClickedButton() {
	print(mouseX, mouseY);
	// print(buttons.simplePlanets[0]);
}
