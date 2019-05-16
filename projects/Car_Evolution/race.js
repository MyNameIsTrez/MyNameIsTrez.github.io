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

  if (!racing) {
    nextGeneration();
  }

  drawLines();

  push();
  fill(255);
  textSize(40);

  text("generation: " + generation, 20, 50);
  // text("laps: " + car.laps + ", score: " + car.score + "/" + car.checkpointCount, 20, 100);

  time = performance.now() - startTime; // The time from the beginning of the generation in ms.
  text("time: " + (time / 1000).toFixed(2) + " sec", width / 2, 50);
  if (recordTime)
    text("record time: " + (recordTime / 1000).toFixed(2) + " sec", width / 2, 100);
  else
    text("record time: " + (time / 1000).toFixed(2) + " sec", width / 2, 100);
  text("fps: " + frameRate().toFixed(0), width - 140, 50);
  pop();
}

// function saveBestCar() {
//   console.log("Saving the best car...");
//   const car = cars[0];
//   // const json = car.brain.serialize();
//   saveJSON(car.brain, 'car.json');
//   console.log(json);
// }