class Cell {
	constructor(x, y, z, col, row, layer, scene, geometry, material) {
		this.col = col;
		this.row = row;
		this.layer = layer;

		this.addCube(x, y, z, scene, geometry, material);
	}

	addCube(x, y, z, scene, geometry, material) {
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.position.set(x, y, z);
		scene.add(this.cube);
	}

	determineAlive(formulas) {
		let alive;
		this.alive = false;
		for (const formula of formulas) {
			alive = formula(this.col, this.row);
			if (alive) {
				this.alive = true;
			}
		}
	}

	show() {
		this.cube.visible = this.alive;
	}
}
