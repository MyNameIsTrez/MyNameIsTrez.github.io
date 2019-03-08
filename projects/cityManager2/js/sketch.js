// Made by Sander Bos in 2019

let screen = "game";
const colors = {
	white: [255, 255, 255],
	black: [0, 0, 0],
	solarizedLight: [68, 90, 97],
	solarizedDark: [7, 54, 66],
	solarizedGray: [147, 161, 161]
};
const cellsH = 9,
	cellsV = 7,
	cellW = 16,
	cellH = 16;
const sprites = {
	"empty": 0,
	"farm": 0,
	"house": 0,
	"laboratory": 0,
	"office": 0,
	"reactor": 0,
	"uraniumMine": 0,
	"windmill": 0,
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight).elt.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	gameScreen.createSprites();
	gameScreen.createCells();
}

function draw() {
	background(colors.solarizedLight)
	switch (screen) {
		case "game":
			gameScreen.gameScreen();
			break;
	}
}