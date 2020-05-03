class Grid {
	constructor(cols, rows, layers, formulas, scene, geometry, material) {
		this.cols = cols;
		this.rows = rows;
		this.layers = layers;

		this.formulas = formulas;

		this.scene = scene;
		this.geometry = geometry;
		this.material = material;
	}

	create_wireframe_border() {
		const geo_wireframe = new THREE.BoxGeometry(this.cols, this.rows, this.layers);
		const edges = new THREE.EdgesGeometry(geo_wireframe);
		const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
		const wireframe = new THREE.LineSegments(edges, mat);
		wireframe.position.set(this.cols / 2 - 0.5, this.rows / 2 - 0.5, this.layers / 2 - 0.5);
		this.scene.add(wireframe);
	}

	determine_place(col, row, layer) {
		let place;
		for (const formula of this.formulas) {
			place = formula(col, row, layer);
			if (place) {
				return true;
			}
		}
		return false;
	}

	create_cells() {
		let cell, box_mesh;
		this.cells = [];
		box_mesh = new THREE.Mesh(this.geometry, this.material);
		const geo_single = new THREE.Geometry();

		for (let col = 0; col < this.cols; col++) {
			this.cells.push([]);
			// flip y-axis from top-bottom to bottom-top
			// for (let row = this.rows - 1; row >= 0; row--) {
			for (let row = 0; row < this.rows; row++) {
				this.cells[col].push([]);
				for (let layer = 0; layer < this.layers; layer++) {
					if (this.determine_place(col, row, layer)) {
						cell = new Cell(col, row, layer);
						// cell.box = box_mesh.clone();
						cell.box = box_mesh;
						cell.box.position.set(cell.col, cell.row, cell.layer);
						geo_single.mergeMesh(cell.box);
						this.cells[col][row][layer] = cell;
					}
				}
			}
		}

		// const material_array = [
		// 	new THREE.MeshBasicMaterial({ color: 0xFF0000 }),
		// 	new THREE.MeshBasicMaterial({ color: 0x00FF00 }),
		// ];
		// const mesh = new THREE.Mesh(geo_single, material_array);

		const mesh = new THREE.Mesh(geo_single, this.material);
		this.scene.add(mesh);
	}

	print_cell_data_lua() {
		let cellData, cell;
		const positions = { x: [], y: [], z: [] };

		for (let col = 0; col < this.cols; col++) {
			for (let row = 0; row < this.rows; row++) {
				for (let layer = 0; layer < this.layers; layer++) {
					cell = this.cells[col][row][layer];
					if (cell) {
						positions.x.push(col);
						positions.y.push(row);
						positions.z.push(layer);
					}
				}
			}
		}
		let string = JSON.stringify(positions);
		// Convert the JSON format to Lua.
		string = string.replace(/\[/g, '{');
		string = string.replace(/\]/g, '}');
		string = string.replace(/:/g, '=');
		string = string.replace(/"/g, '');
		console.log(string);
	}
}