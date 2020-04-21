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

function formula1(x, y, z) {
	return x * y * z > 500;
}

function formula2(x, y, z) {
	return x === y && y === z;
}


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
const material = new THREE.MeshBasicMaterial({ color: color });


// GRID
const formulas = [
	formula1,
	formula2
];

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