function nextGeneration() {
  generation++;
  calculateFitness();
  getBestCar();
  for (let i = 1; i < carCount; i++) {
    cars[i] = newCar();
  }
  savedCars = [];
  startTime = performance.now();
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


function getBestCar() {
  const carArgs = [1200, 600, 270, sliderFOV.value(), sliderRayCount.value(), getBestCarBrain()];
  cars[0] = new Car(carArgs);
  bestCar = cars[0];
}


function getBestCarBrain() {
  let bestCarBrain;
  let record = 0;
  for (const savedCar of savedCars) {
    if (savedCar.fitness > record) {
      record = savedCar.fitness;
      bestCarBrain = savedCar.brain;
    }
  }
  return bestCarBrain;
}


function newCar() {
  // Algorithm for choosing a random number and seeing where it falls into the spread of all the probability values.
  var index = 0;
  var r = random();
  while (r > 0) {
    r = r - savedCars[index].fitness;
    index++;
  }
  index--;

  let car = savedCars[index];
  const carArgs = [1200, 600, 270, sliderFOV.value(), sliderRayCount.value(), car.brain];
  let child = new Car(carArgs);
  child.mutate();
  return child;
}