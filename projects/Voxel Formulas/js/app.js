/*
This program draws a 3D grid of cells. Cells can either be drawn or not drawn.
Drawing of a cell is determined by the formula functions in the `formulas` array below.
Edit the formula functions to create interesting patterns!
*/

// CONFIGURABLE

// grid
const cols = 20;
const rows = 20;
const layers = 20;

const circleRadius = 5;
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
	function (x, y, z) {
		return x + y * 4 % z > 10 + x;
	},
];

// three.js
const cameraRotateScale = 30;

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

const geometry = new THREE.BoxGeometry(1, 1, 1);

// var loader = new THREE.CubeTextureLoader();
// loader.setPath('textures/');

// const textureCube = loader.load([
// 	'planks_oak.png', 'planks_oak.png',
// 	'planks_oak.png', 'planks_oak.png',
// 	'planks_oak.png', 'planks_oak.png',
// ]);
// const material = new THREE.MeshBasicMaterial({ envMap: textureCube });

const texture = new THREE.TextureLoader().load('textures/planks_oak.png');
const material = new THREE.MeshBasicMaterial({ map: texture });


// GRID
const width = cols;
const height = rows;

const grid = new Grid(cols, rows, layers, formulas, scene, geometry, material);

// grid.drawGridLines();

grid.createCells();
grid.setAliveCells();
grid.drawAliveCells();

grid.consoleLogCells();


// THREE.JS
const animate = function () {
	requestAnimationFrame(animate);

	const timer = Date.now() * 0.0005;

	camera.position.x = Math.cos(timer) * cameraRotateScale;
	camera.position.y = Math.sin(timer) * cameraRotateScale;
	camera.position.z = Math.sin(timer) * cameraRotateScale;

	camera.lookAt(lookAtVec);
	// camera.lookAt(scene.position);

	renderer.render(scene, camera);
};

animate();