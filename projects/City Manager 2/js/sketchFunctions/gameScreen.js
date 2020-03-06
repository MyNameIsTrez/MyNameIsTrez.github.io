const gameScreen = {};
let cells = [];

gameScreen.createSprites = function () {
	for (const name in sprites) {
		sprites[name] = loadImage(`sprites/${name}.png`);
	}
}

gameScreen.createCells = function () {
	for (let i = 0; i < cellsVer; i++) {
		cells.push([]);
		for (let j = 0; j < cellsHor; j++) {
			cells[i].push(new Cell(j * cellWidth, i * cellHeight, "empty"));
		}
	}

	gameWidth = cellsHor * cellWidth;
	gameHeight = cellsVer * cellHeight;
}

gameScreen.gameScreen = function () {
	cells.forEach(row => {
		row.forEach(cell => {
			cell.draw();
		});
	});

	if (mouseIsPressed) {
		if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
			const i = floor(mouseY / cellHeight);
			const j = floor(mouseX / cellWidth);
			cells[i][j].clicked();
		}
	}
}