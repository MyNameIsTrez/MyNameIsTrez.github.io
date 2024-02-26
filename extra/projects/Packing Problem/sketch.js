const circleCount = 5;
const circleRadius = 50;

const canvasWidth = 500;
const canvasHeight = 500;

let circles = [];

let smallestArea = Infinity;

function setup() {
	createCanvas(canvasWidth, canvasHeight);
}

function draw() {
	newCircles();
	scoreCircles();
}

function newCircles() {
	for (let i = 0; i < circleCount; i++) {
		circles[i] = [random(), random()];
	}
}

function scoreCircles() {
	let minX = 1, maxX = 0, minY = 1, maxY = 0;
	let x, y;

	circles.forEach(circ => {
		x = circ[0], y = circ[1];
		minX = min(minX, x);
		maxX = max(maxX, x);
		minY = min(minY, y);
		maxY = max(maxY, y);
	});

	const w = maxX - minX, h = maxY - minY;
	const area = w * h;

	if (area < smallestArea) {
		smallestArea = area;
		visualize(minX, maxX, minY, maxY, area);
	}
}

function visualize(minX, maxX, minY, maxY, area) {
	background(50);
	drawCircles();
	drawAreaRect(minX, maxX, minY, maxY);
	console.log(area);
}

function drawCircles() {
	noStroke();
	fill(200);
	circles.forEach(circ => circle(circ[0] * canvasWidth, circ[1] * canvasHeight, circleRadius));
}

function drawAreaRect(minX, maxX, minY, maxY) {
	stroke(255);
	noFill();
	rect(minX * canvasWidth, minY * canvasHeight, (maxX - minX) * canvasWidth, (maxY - minY) * canvasHeight);
}