let savedSnakes = [];
let best;

function nextGeneration() {
  generation++;
  for (const food of foods) {
    food.setNewPos();
  }

  calculateFitness();
  getBest();
  for (let i = 1; i < agentsCount; i++) {
    snakes[i] = getChild(i);
  }
  savedSnakes = [];
}

function calculateFitness() {
  // Get the sum of the scores.
  let sum = 0;
  for (const snake of savedSnakes) {
    sum += snake.score;
  }
  // Normalize the fitness score between 0 and 1.
  for (const snake of savedSnakes) {
    snake.fitness = snake.score / sum;
    // console.log(snake.fitness);
  }
}


function getBest() {
  const bestSnake = new Snake(0, getBestBrain());
  snakes[0] = bestSnake;
  best = bestSnake;

  bestSnake.emptyPxls();
  bestSnake.addSnakePxls();
  bestSnake.food = new Food(0);
  bestSnake.addFoodPxls();
}

function getBestBrain() {
  let bestSnakeBrain;
  let record = 0;
  for (const savedSnake of savedSnakes) {
    if (savedSnake.fitness > record) {
      record = savedSnake.fitness;
      bestSnakeBrain = savedSnake.brain;
    }
  }
  return bestSnakeBrain;
}


function getChild(i) {
  // Algorithm for choosing a random number and seeing where it falls into the spread of all the probability values.
  var index = 0;
  var r = random();
  while (r > 0) {
    r = r - savedSnakes[index].fitness;
    index++;
  }
  index--;

  let snake = savedSnakes[index];
  let child = new Snake(i, snake.brain);


  snakes[i] = child;
  child.emptyPxls();
  child.addSnakePxls();
  child.food = new Food(i);
  child.addFoodPxls();

  child.mutate();

  return child;
}