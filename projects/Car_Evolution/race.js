let carKeys = [];
let isUp, isLeft, isRight;
let startTime, time, recordTime;
let drawRays = false;

function raceUpdate() {
  background(63);

  // switch (state) {
  //   case 'race':
  //     if (carKeys[0]) {
  //       car.thrust();
  //     }
  //     if (carKeys[1] && carKeys[0]) {
  //       car.turn(-0.015);
  //     }
  //     if (carKeys[2] && carKeys[0]) {
  //       car.turn(0.015);
  //     }
  //     break;
  // }

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
    generation++;
    startTime = performance.now();
    for (const car of cars)
      car.respawn();
  }

  drawLines();

  push();
  fill(255);
  textSize(40);

  text("generation: " + generation, 20, 50);
  // text("laps: " + car.laps + ", points: " + car.points + "/" + car.checkpointCount, 20, 100);

  time = performance.now() - startTime; // The time from the beginning of the generation in ms.
  text("time: " + (time / 1000).toFixed(2) + " sec", 420, 50);
  if (recordTime)
    text("record time: " + (recordTime / 1000).toFixed(2) + " sec", 420, 100);
  else
    text("record time: " + (time / 1000).toFixed(2) + " sec", 420, 100);
  pop();
}