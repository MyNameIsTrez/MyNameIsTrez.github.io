let snakes = [];
let foods = [];

const width = innerWidth - 5; // The Width that can be used for drawing this program.
const height = innerHeight - 29; // The height that can be used for drawing this program.
const w = 3; // How many 'pxls' there are horizontally per snake game.
const h = 3; // How many 'pxls' there are horizontally per snake game.
const agentsHor = 50; // How many snakes there are horizontally.
const agentsVer = 50; // How many snakes there are vertically.
const mutationRate = 0.1; // How much snakes will mutate after each generation.
const debugColors = false; // Colors the head, body and tail of each snake differently.
const maxTicksWithoutFood = 10; // The maximum amount of ticks that a snake can go without food before dying.
// const tickSpeed = 1;
let drawing = true;
let speedMult;

const agentsCount = agentsHor * agentsVer;
const maxSclWidth = width / w / agentsHor;
const maxSclHeight = height / h / agentsVer;
const scl = maxSclWidth < maxSclHeight ? maxSclWidth : maxSclHeight;
const agentWidth = scl * w;
const agentHeight = scl * h;
const finalWidth = agentWidth * agentsHor;
const finalHeight = agentHeight * agentsVer;
let generation = 1;

function setup() {
  frameRate(120);
  const sliderSpeedMult = createSlider(1, 60, 1).input(function () {
    speedMult = sliderSpeedMult.value();
  });
  speedMult = sliderSpeedMult.value();
  createButton('draw').mousePressed(function () {
    drawing = !drawing;
  });

  createCanvas(finalWidth, finalHeight);

  background(0);
  for (let i = 0; i < agentsCount; i++) {
    const snake = new Snake(i);
    snakes[i] = snake;
    snake.emptyPxls();
    snake.addSnakePxls();
    snake.food = new Food(i);
    snake.addFoodPxls();
    // snakes[i] = snake; // I don't think this line is necessary, because 'snakes' just stores a pointer to the snake object, and doesn't copy the snake object. We can thus add 'food' after it has been added to 'snakes'.
  }

  if (drawing) {
    for (const snake of snakes) {
      snake.draw();
      snake.food.draw();
      snake.drawBorder();
    }
  }

  drawGenCount();
  drawFrameRateCount();
}

function draw() {
  if (frameCount % speedMult === 0) { // Slows the game down.
    // for (let i = 0; i < tickSpeed; i++) {
    background(0);
    for (const snake of snakes) {
      if (snake.alive === true) {
        snake.emptyPxls();
        snake.addSnakePxls();
        snake.addFoodPxls();

        snake.update();

        if (snake.checkDeath()) {
          snake.die();
        }

        if (snake.eat(snake.food.pos)) {
          snake.grow();
          snake.score++;
          snake.food.setNewPos();
        } else {
          snake.ticksWithoutFood++;
        }

        if (drawing) {
          snake.draw();
        }
      }

      if (drawing) {
        snake.food.draw();
        snake.drawBorder();
      }
    }

    drawGenCount();
    drawFrameRateCount();

    // Check if all snakes are dead. If so, we go to the next generation.
    let allSnakesDead = true;
    for (const snake of snakes) {
      if (snake.alive) {
        allSnakesDead = false;
      }
    }
    if (allSnakesDead) {
      nextGeneration();
    }
    // }
  }
}

function drawGenCount() {
  push();
  textSize(30);
  stroke(0);
  strokeWeight(3);
  fill(150, 255, 0);
  text(`Generation: ${generation}`, 10, 35);
  pop();
}

function drawFrameRateCount() {
  push();
  textSize(30);
  stroke(0);
  strokeWeight(3);
  fill(150, 255, 0);
  text(`FPS: ${floor(frameRate())}`, 10, 75);
  pop();
}