// Recreation of https://humanbenchmark.com/tests/chimp
// Made by Sander Bos in 2020


///////////////////
// TODO:
//
// - Fade in next level.
// - Popups.
//   - Strike popup.
//   - Game over popup.
//   - Win popup.
//   - Highscores popup.
//     - Enter 3 letter name.
//   - Inactivity alert.
//     - Prevents people continuing from where someone else left off somewhat.
//     - If the user doesn't do anything when the popup appears, the game restarts in 10+ sec.
// - Make it impossible to lose the first level.
//   - Gray out cells the user can't guess.
//   - Make clear with particle effects which one to click.
// - Arcade cabinet controls with a Class.
// - Play sounds that are unobtrusive.
//   - Guessing cells.
//   - Strike.
//   - Game over.
//   - Win.
//   - Home screen.
// - Title screen.
//   - Start game button.
//   - Highscores listed on the left-/right-hand side.
//   - Simple animation, can use SVGs.
// - Transitions.
//   - Transition is a colored line oriented NE-SW.
//     - Moves from the top-left to the bottom-right.
//     - title screen <-> game
//     - game -> high score screen
// - Effects.
//   - Making correct guesses flashes the screen green.
//     - Bézier curve or lerp for fading.
//   - A strike flashes the screen orange.
//   - Game over flashes the screen red.
//   - A 100% win flashes the screen green & yellow.
//     - Make it cool, because it's virtually impossible.
//     - Tease it in the title screen. "Can you reach the end?"
//     - Highlight a 100% completion in the scoreboard with rainbow
//     - Allow entering up to way more than 3 letters.
//   - Use fireworks from my other P5.js fireworks project.
// - Copy lore from humanbenchmark website, along with the graph.
// - Center canvas.
//
///////////////////


///////////////////
// CUSTOMIZABLE
const CELLS_HOR = 8;
const CELLS_VER = 5;
///////////////////


///////////////////
// NOT CUSTOMIZABLE
const CELLS_TOTAL = CELLS_HOR * CELLS_VER;
const WIDTH = innerWidth;
const HEIGHT = innerHeight;
const GAME_SCREEN_OFFSET_MULT = 0.63;
const REAL_CELL_SIZE = Math.min(WIDTH * GAME_SCREEN_OFFSET_MULT / CELLS_HOR, HEIGHT * GAME_SCREEN_OFFSET_MULT / CELLS_VER);
const FAKE_CELL_SIZE = REAL_CELL_SIZE * 0.9;
const EDGE_SPACE_WIDTH = REAL_CELL_SIZE * 0.05;
const TEXT_SIZE = REAL_CELL_SIZE * 0.65;
const GAME_HOR_OFFSET = (WIDTH - REAL_CELL_SIZE * CELLS_HOR) / 2;
const GAME_VER_OFFSET = (HEIGHT - REAL_CELL_SIZE * CELLS_VER) / 2;
const CELL_CURVATURE = REAL_CELL_SIZE * 0.15;
const TEXT_OFFSET_DOWN = REAL_CELL_SIZE * 0.05;

let firstLevelBool = true;
let grid;
let score = 4;
let nextCorrectGuess;
let strikes = 0;
let startedGuessing;
///////////////////


function setup() {
	createCanvas(WIDTH - 1, HEIGHT - 1);
	initMisc();
	initGrid();
	nextLevel();
	firstLevel();
}


function draw() {
	background("#3a87ce");
	drawGrid();
}


function initMisc() {
	strokeWeight(EDGE_SPACE_WIDTH);
	textAlign(CENTER, CENTER);
}


function initGrid() {
	grid = [];
	for (let ix = 0; ix < CELLS_HOR; ix++) {
		grid[ix] = [];
		for (let iy = 0; iy < CELLS_VER; iy++) {
			grid[ix][iy] = 0;
		}
	}
}


function nextLevel() {
	if (score <= CELLS_TOTAL) {
		nextCorrectGuess = 1;
		startedGuessing = false;
		fillGrid(score);
	} else {
		win();
	}
}


function firstLevel() {
	console.log("first level");
}


function loopGrid(fn) {
	for (let ix = 0; ix < CELLS_HOR; ix++) {
		for (let iy = 0; iy < CELLS_VER; iy++) {
			fn(ix, iy);
		}
	}
}


function fillGrid(n) {
	let num = 1;
	while (num <= n) {
		const ix = randInt(CELLS_HOR);
		const iy = randInt(CELLS_HOR);
		if (grid[ix][iy] === 0) {
			grid[ix][iy] = num;
			num++;
		}
	}
}


function randInt(n) {
	return floor(random(n));
}


function drawGrid() {
	loopGrid((ix, iy) => {
		const num = grid[ix][iy];
		if (num !== 0) {
			if (!startedGuessing || firstLevelBool) {
				drawShownCells(ix, iy, num);
			} else {
				drawHiddenCells(ix, iy);
			}
		}
		// else {
		// 	stroke("#ffffff");
		// 	noFill();
		// 	square(ixToFakeCellX(ix), iyToFakeCellY(iy), FAKE_CELL_SIZE, CELL_CURVATURE);
		// }
	});
}


function drawShownCells(ix, iy, num) {
	stroke("#4e93d3");
	noFill();
	square(ixToFakeCellX(ix), iyToFakeCellY(iy), FAKE_CELL_SIZE, CELL_CURVATURE);

	noStroke();
	fill("#ffffff");
	textSize(TEXT_SIZE);
	text(num, ixToFakeTextX(ix), iyToFakeTextY(iy) + TEXT_OFFSET_DOWN);
}


function drawHiddenCells(ix, iy) {
	stroke("#ffffff");
	fill("#ffffff");
	square(ixToFakeCellX(ix), iyToFakeCellY(iy), FAKE_CELL_SIZE, CELL_CURVATURE);
}


function ixToFakeCellX(ix) {
	return indexToFakeCellPos(ix) + GAME_HOR_OFFSET;
}


function iyToFakeCellY(iy) {
	return indexToFakeCellPos(iy) + GAME_VER_OFFSET;
}


function indexToFakeCellPos(i) {
	return indexToPos(i) + EDGE_SPACE_WIDTH;
}


function indexToPos(i) {
	return i * REAL_CELL_SIZE;
}


function ixToFakeTextX(ix) {
	return indexToFakeTextPos(ix) + GAME_HOR_OFFSET;
}


function iyToFakeTextY(iy) {
	return indexToFakeTextPos(iy) + GAME_VER_OFFSET;
}


function indexToFakeTextPos(i) {
	return indexToPos(i) + REAL_CELL_SIZE / 2;
}


function emptyGrid() {
	loopGrid((ix, iy) => {
		grid[ix][iy] = 0;
	});
}


function xToIndex(x) {
	return xyToIndex(x - GAME_HOR_OFFSET);
}


function yToIndex(y) {
	return xyToIndex(y - GAME_VER_OFFSET);
}


function xyToIndex(xy) {
	return floor(xy / REAL_CELL_SIZE);
}


function mousePressed() {
	const x = xToIndex(mouseX);
	const y = yToIndex(mouseY);
	if (x < CELLS_HOR && y < CELLS_VER) {
		const n = grid[x][y];
		if (n !== 0) {
			startedGuessing = true;
			if (n === nextCorrectGuess) {
				correctGuess(x, y);
			} else {
				wrongGuess();
			}
		}
	}
}


function correctGuess(x, y) {
	grid[x][y] = 0;
	nextCorrectGuess++;
	if (nextCorrectGuess - 1 === score) {
		score++;
		if (firstLevelBool) {
			firstLevelBool = false;
		}
		nextLevel();
	}
}


function wrongGuess() {
	strikes++;
	if (strikes < 3) {
		strike();
	} else {
		gameOver();
	}
}


function strike() {
	console.log(`strike ${strikes} of 3`);
}


function gameOver() {
	console.log("game over");
}


function win() {
	console.log("you won");
}