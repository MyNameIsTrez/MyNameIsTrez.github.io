const fireworks = [];
const FPS = 60;
const gravity = 0.2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  stroke(255);
  frameRate(FPS);
}

function draw() {
  if (frameCount % FPS === 0) {
    fireworks.push(new Firework(random(0, width)));
    console.log(fireworks.length);
  }

  for (const firework of fireworks) {
    firework.draw();
  }
}