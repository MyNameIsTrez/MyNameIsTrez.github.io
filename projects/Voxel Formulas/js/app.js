/*
This program draws a grid of cells that can either be turned on or off.
This is determined by the formula functions in the `formulas` array below.
You should edit the formula functions to create interesting patterns!
The bottom-left of the canvas is cell (0;0), the top-right is (cols;rows).
*/

// CONFIGURABLE

// grid
const cols = 20;
const rows = 20;
const layers = 20;
const size = 1; // default is 1

const formulas = [
	function (x, y, z) {
		return x * y * z > 500;
	},
	function (x, y, z) {
		return x === y && y === z;
	},
	function (x, y, z) {
		return x + y * 4 % y > 10;
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

const color = 0xffffff;

// NOT CONFIGURABLE


// THREE.JS
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(FOV, aspect, near, far);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(size, size, size);

// var loader = new THREE.CubeTextureLoader();
// loader.setPath('textures/');

// const textureCube = loader.load([
// 	'planks_oak.png', 'planks_oak.png',
// 	'planks_oak.png', 'planks_oak.png',
// 	'planks_oak.png', 'planks_oak.png',
// ]);
// const material = new THREE.MeshBasicMaterial({ color: color, envMap: textureCube });

const texture = new THREE.TextureLoader().load('textures/planks_oak.png');
const material = new THREE.MeshBasicMaterial({ color: color, map: texture });


// GRID
const width = cols * size;
const height = rows * size;

const grid = new Grid(cols, rows, layers, size, formulas, scene, geometry, material);

// grid.drawGridLines();

grid.createCells();
grid.setAliveCells();
grid.drawAliveCells();


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