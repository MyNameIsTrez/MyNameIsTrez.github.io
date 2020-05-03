class Cell {
	constructor(col, row, layer) {
		this.col = col;
		this.row = row;
		this.layer = layer;
	}

	determine_alive(formulas) {
		this.place = false;
		let place;
		for (const formula of formulas) {
			place = formula(this.col, this.row, this.layer);
			if (place) {
				this.place = true;
				return;
			}
		}
	}
}
