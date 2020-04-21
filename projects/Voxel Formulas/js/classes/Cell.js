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
		this.alive = false;
		let alive;
		for (const formula of formulas) {
			alive = formula(this.col, this.row, this.layer);
			if (alive) {
				this.alive = true;
				return;
			}
		}
	}

	show() {
		this.cube.visible = this.alive;
	}
}
