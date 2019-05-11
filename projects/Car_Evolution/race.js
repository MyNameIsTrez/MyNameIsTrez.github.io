let carKeys = [];
let isUp, isLeft, isRight;

function raceUpdate() {
  background(63);

  switch (state) {
    case 'race':
      if (carKeys[0]) {
        car.thrust();
      }
      if (carKeys[1]) {
        car.turn(-0.1);
      }
      if (carKeys[2]) {
        car.turn(0.1);
      }
      break;
  }

  for (const wall of walls) {
    wall.show();
  }

  car.update();
  car.draw();

  drawLines();

  push();
  stroke(255);
  fill(255);
  textSize(40);
  text("generation: " + generation, 20, 50);
  pop();
}