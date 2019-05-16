let carKeys = [];
let isUp, isLeft, isRight;
let startTime, time, recordTime;
let bestCar;

function raceUpdate() {
  background(63);

  for (const wall of walls) {
    wall.show();
  }

  let racing = false;
  for (const car of cars) {
    if (car.alive) {
      racing = true;
      car.update();
      car.draw();
    }
  }

  if (renderRayCasting && bestCar) {
    bestCar.getRayLengths(bestCar, walls);

    push();
    translate(width / 2, 0);
    // Black background.
    fill(0);
    noStroke();
    rect(0, 0, width / 2, height);
    pop();
    const rayLengths = bestCar.getRayLengths(bestCar, walls);
    // console.log(rayLengths);
    bestCar.renderRaycast(rayLengths);
  }

  if (!racing) {
    generation++;
    startTime = performance.now();
    nextGeneration();
  }

  drawLines();

  push();
  fill(255);
  textSize(40);

  text("generation: " + generation, 20, 50);
  // text("laps: " + car.laps + ", score: " + car.score + "/" + car.checkpointCount, 20, 100);

  time = performance.now() - startTime; // The time from the beginning of the generation in ms.
  text("time: " + (time / 1000).toFixed(2) + " sec", 420, 50);
  if (recordTime)
    text("record time: " + (recordTime / 1000).toFixed(2) + " sec", 420, 100);
  else
    text("record time: " + (time / 1000).toFixed(2) + " sec", 420, 100);
  text("fps: " + frameRate().toFixed(0), 1200, 50);
  pop();
}

// function saveBestCar() {
//   console.log("Saving the best car...");
//   const car = cars[0];
//   // const json = car.brain.serialize();
//   saveJSON(car.brain, 'car.json');
//   console.log(json);
// }