function nextGeneration() {
  calculateFitness();

  cars[0] = getBestCar();
  for (let i = 1; i < carCount; i++) {
    cars[i] = pickOne();
  }

  savedCars = [];
}

function getBestCar() {
  let record = 0;
  let bestCar;
  for (const savedCar of savedCars) {
    if (savedCar.fitness > record) {
      record = savedCar.fitness;
      bestCar = savedCar;
    }
  }
  return bestCar;
}

function pickOne() {
  // Algorithm for choosing a random number and seeing where it falls into the spread of all the probability values.
  var index = 0;
  var r = random(1);
  while (r > 0) {
    r = r - savedCars[index].fitness;
    index++;
  }
  index--;

  let car = savedCars[index];
  const carArgs = [800, 600, 270, sliderFOV.value(), sliderRayCount.value(), car.brain];
  let child = new Car(carArgs);
  child.mutate();
  return child;
}

function calculateFitness() {
  // Get the sum of the car scores.
  let sum = 0;
  for (const car of savedCars) {
    sum += car.score;
  }
  // Normalize the fitness score as 0-1.
  for (const car of savedCars) {
    car.fitness = car.score / sum;
  }
}