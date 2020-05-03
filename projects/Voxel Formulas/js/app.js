/*
This program draws a 3D grid of cells. Cells can either be drawn or not drawn.
Drawing of a cell is determined by the formula functions in the `formulas` array below.
Edit the formula functions to create interesting patterns!
*/

// CONFIGURABLE

// grid
const cols = 100;
const rows = 100;
const layers = 100;

const circleRadius = 10;
const circleCurvature = 3;

const formulas = [
	// function (x, y, z) {
	// 	return false;
	// },
	function (x, y, z) {
		return (x - cols / 2) ** 2 +
			(y - rows / 2) ** 2 +
			(z - layers / 2) ** 2 <
			circleRadius ** 2 + circleCurvature;
	},
	// function (x, y, z) {
	// 	return x * y * z > 500;
	// },
	function (x, y, z) {
		return x === y && y === z;
	},
	// function (x, y, z) {
	// 	return true
	// }
	// function (x, y, z) {
	// 	return x + y * 4 % z > 10 + x;
	// },
];

// three.js
const cameraRotateScale = 40;

const lookAtVec = new THREE.Vector3(cols / 2, rows / 2, layers / 2);

const FOV = 75;
const aspect = window.innerWidth / window.innerHeight;

// objects further away from the camera than the value of far or closer than near won't be rendered
const near = 0.1;
const far = 1000;


// NOT CONFIGURABLE

// THREE.JS
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(FOV, aspect, near, far);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// I think I'll need to use NPM w/ Webpack or Browserify to use this.
// https://threejs.org/docs/#manual/en/introduction/Import-via-modules
// controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);

const geo_block = new THREE.BoxGeometry();

const tex_planks_oak = new THREE.TextureLoader().load('textures/planks_oak.png');
const mat_planks_oak = new THREE.MeshBasicMaterial({ map: tex_planks_oak });

// GRID
const width = cols;
const height = rows;

const grid = new Grid(cols, rows, layers, formulas, scene, geo_block, mat_planks_oak);

grid.create_wireframe_border();

grid.create_cells();

grid.print_cell_data_lua();


// THREE.JS
const animate = function () {
	requestAnimationFrame(animate);

	const timer = Date.now() * 0.0005;

	camera.position.x = Math.cos(timer) * cameraRotateScale;
	camera.position.y = Math.sin(timer) * cameraRotateScale;
	camera.position.z = Math.sin(timer) * cameraRotateScale;

	camera.lookAt(lookAtVec);
	// camera.lookAt(scene.position);

	// console.log(scene);
	renderer.render(scene, camera);
};

animate();