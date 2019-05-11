function raceUpdate() {
  background(63);

  if (keyIsPressed) {
    switch (state) {
      case 'race':
        if (key === 'w') // go forwards
            car.thrust();
        if (key === 'a')
            car.turn(-0.1); // turn left
        if (key === 'd')
            car.turn(0.1); // turn right
        break;
    }
  }
  
  for (const wall of walls) {
    wall.show();
  }

  car.update();
  car.draw();
  
  drawLines();
}