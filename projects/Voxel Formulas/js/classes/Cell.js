class Cell {
	constructor(x, y, col, row, scene, geometry, material) {
		this.col = col;
		this.row = row;
		this.addCube(x, y, scene, geometry, material);
	}

	addCube(x, y, scene, geometry, material) {
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.position.set(x, y, 0);
		scene.add(this.cube);
	}

	determineAlive(formulas) {
		this.alive = false;
		for (const formula of formulas) {
			const alive = formula(this.col, this.row);
			if (alive) {
				this.alive = true;
			}
		}
	}

	show() {
		this.cube.visible = this.alive;
	}
}