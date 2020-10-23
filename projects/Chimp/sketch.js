// Recreation of https://humanbenchmark.com/tests/chimp
// Made by Sander Bos in 2020


///////////////////
// TODO:
//
// - Cell sizes based on innerWidth and innerHeight.
// - Fade in next level.
// - Strike popup.
// - Game over popup.
// - Win popup.
// - Highscores popup.
//   - 3 letter names.
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
//
///////////////////


///////////////////
// CUSTOMIZABLE
const CELLS_HOR = 8;
const CELLS_VER = 5;

// Cells are 90x90 px, of which 80x80 px are visible. The rest is empty.
const REAL_CELL_SIZE = 100;
const FAKE_CELL_SIZE = 90;
const EDGE_WIDTH = 5;
const SPACE_WIDTH = 5;
const TEXT_SIZE = 65;
const CELL_CURVATURE = 10;
const TEXT_OFFSET_DOWN = 5;
///////////////////


///////////////////
// NOT CUSTOMIZABLE
const CELLS_TOTAL = CELLS_HOR * CELLS_VER;

let firstLevelBool = true;
let grid;
let score = 4;
let nextCorrectGuess;
let strikes = 0;
///////////////////


function setup() {
	createCanvas(innerWidth - 1, innerHeight - 1);
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
	strokeWeight(EDGE_WIDTH);
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
	let ix, iy;
	let num = 1;
	while (num <= n) {
		ix = randInt(CELLS_HOR);
		iy = randInt(CELLS_HOR);

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
			stroke("#4e93d3");
			noFill();
			square(indexToFakeCellPos(ix), indexToFakeCellPos(iy), FAKE_CELL_SIZE, CELL_CURVATURE);

			noStroke();
			fill("#ffffff");
			textSize(TEXT_SIZE);
			text(num, indexToFakeTextPos(ix), indexToFakeTextPos(iy) + TEXT_OFFSET_DOWN);
		}
	});
}


function indexToFakeCellPos(i) {
	return indexToPos(i) + SPACE_WIDTH;
}


function indexToPos(i) {
	return i * REAL_CELL_SIZE;
}


function indexToFakeTextPos(i) {
	return indexToPos(i) + REAL_CELL_SIZE / 2;
}


function emptyGrid() {
	loopGrid((ix, iy) => {
		grid[ix][iy] = 0;
	});
}


function posToIndex(px) {
	return floor(px / REAL_CELL_SIZE);
}


function mousePressed() {
	const x = posToIndex(mouseX);
	const y = posToIndex(mouseY);
	if (x < CELLS_HOR && y < CELLS_VER) {
		const n = grid[x][y];
		if (n !== 0) {
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