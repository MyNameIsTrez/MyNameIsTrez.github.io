function preload() {
  defaultImg = loadImage('default.png');
}

function setup() {
  createCanvas(width, height);
  noSmooth(); // Disables anti-aliasing.

  createChars();
  
  term = new Term();
}

function draw() {
  background(30);
  
  // showChars();
  // showCharOutlines();
  
  term.update();
}