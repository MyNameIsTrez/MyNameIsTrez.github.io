function mousePressed() {
	if (mouseX > 0 && mouseX < gameWidth && mouseY > 0 && mouseY < gameHeight) {
		firstCellType = cells[floor(mouseY / cellHeight)][floor(mouseX / cellWidth)].type;
	}
}