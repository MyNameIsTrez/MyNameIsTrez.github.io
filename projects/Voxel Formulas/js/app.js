/*
This program draws a grid of cells that can either be turned on or off.
This is determined by the formula functions in the `formulas` array below.
You should edit the formula functions to create interesting patterns!
The bottom-left of the canvas is cell (0;0), the top-right is (cols;rows).
*/

// CONFIGURABLE

// grid
const cols = 100;
const rows = 80;
const size = 0.5; // default is 1

function formula1(x, y) {
	return x * y > 1000;
}

function formula2(x, y) {
	return x === y;
}


// three.js
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

camera.position.z = 50;


// GRID
const formulas = [
	formula1,
	formula2
];

const width = cols * size;
const height = rows * size;

const geometry = new THREE.BoxGeometry(size, size, size);
const material = new THREE.MeshBasicMaterial({ color: color });

const grid = new Grid(cols, rows, size, formulas, scene, geometry, material);

// grid.drawGridLines();

grid.createCells();
grid.setAliveCells();
grid.drawAliveCells();


// THREE.JS
const animate = function () {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

animate();