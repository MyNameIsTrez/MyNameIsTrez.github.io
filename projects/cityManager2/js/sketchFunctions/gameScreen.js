const gameScreen = {};
let cells = [];

gameScreen.createSprites = function () {
	for (const name in sprites) {
		sprites[name] = loadImage(`sprites/${name}.png`);
	}
}

gameScreen.createCells = function () {
	for (let i = 0; i < cellsV; i++) {
		cells.push([]);
		for (let j = 0; j < cellsH; j++) {
			cells[i].push(new Cell(j * cellW, i * cellH, "empty"));
		}
	}
}

gameScreen.gameScreen = function () {
	cells.forEach(row => {
		row.forEach(cell => {
			cell.draw();
		});
	});
}