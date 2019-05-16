class Car {

  constructor(...args) {
    const [xStart, yStart, rotation, fov, rayCount, brain] = Array.isArray(args[0]) ? args[0] : args;
    this.startPos = createVector(xStart, yStart);
    this.pos = createVector(xStart, yStart);
    this.width = 10;
    this.height = 20;
    this.fov = fov;
    this.rayCount = rayCount;

    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.startHeading = radians(rotation) - PI / 2;
    this.heading = radians(rotation) - PI / 2; // Should really be a vector.
    this.touchingCheckpoint = false;
    this.laps = 0;
    this.seeAnyCheckpointWall = false;
    this.seeCloseCheckpoint = false;
    this.alive = true;

    this.rays = [];
    // The number of created rays are determined by this for loop.
    for (let degrees = this.fov / (this.rayCount + 1) - this.fov / 2; degrees < this.fov / 2; degrees += this.fov / (this.rayCount + 1))
      this.rays.push(new Ray(this.pos, radians(degrees) + this.heading));

    startTime = performance.now();

    this.checkpointCount = 0;
    for (const wall of walls) {
      if (wall.checkpoint)
        this.checkpointCount++;
    }

    // Neuroevolution. Uses the amount of inputs, hidden layers and outputs for generation.
    // The amount of hidden layers is the amount (#inputs + #outputs) / 2.
    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(rayCount, ceil((rayCount + 2) / 2), 2);
    }
  }


  update() {
    let lastTouchingCheckpoint = this.touchingCheckpoint;
    this.checkCrashed();
    if (!lastTouchingCheckpoint && this.touchingCheckpoint)
      this.score++;

    this.vel.add(this.acc);
    this.acc.mult(0.7);
    this.pos.add(this.vel);
    this.vel.mult(0.9);

    const rayLengths = this.getRayLengths(this, walls);
    this.thrust();
    this.think(rayLengths);
    if (this === bestCar && firstPersonView) {
      // Black background.
      push();
      translate(width / 2, 0);
      fill(0);
      noStroke();
      rect(0, 0, width / 2, height);
      pop();

      this.firstPersonView(rayLengths);
    }
  }


  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    // noStroke();
    fill(255, 0, 0);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    pop();
  }


  think(rayLengths) {
    let inputs = [];

    for (const record of rayLengths) {
      inputs.push(record / width); // Map the distance between 0 and 1.
    }

    let output = this.brain.predict(inputs);

    const left = output[0] > 0.5;
    const right = output[1] > 0.5;
    if (left) // Turn left.
      this.turn(-0.015);
    if (right) { // Turn right.
      this.turn(0.015);
    }
  }


  mutate() {
    this.brain.mutate(mutationRate);
  }


  updateFOV(fov) {
    this.fov = fov;
    this.rays = [];
    // The number of created rays are determined by this for loop.
    for (let degrees = this.fov / (this.rayCount + 1) - this.fov / 2; degrees < this.fov / 2; degrees += this.fov / (this.rayCount + 1))
      this.rays.push(new Ray(this.pos, radians(degrees) + this.heading));
  }


  updateRayCount(rayCount) {
    this.rayCount = rayCount;
    this.rays = [];
    // The number of created rays are determined by this for loop.
    for (let degrees = this.fov / (this.rayCount + 1) - this.fov / 2; degrees < this.fov / 2; degrees += this.fov / (this.rayCount + 1))
      this.rays.push(new Ray(this.pos, radians(degrees) + this.heading));
  }


  thrust() {
    const force = p5.Vector.fromAngle(this.heading);
    force.mult(0.06);
    this.acc.add(force);
  }


  turn(a) {
    this.heading += a;
    let index = 0;
    for (let degrees = this.fov / (this.rayCount + 1) - this.fov / 2; degrees < this.fov / 2; degrees += this.fov / (this.rayCount + 1)) {
      this.rays[index].setAngle(radians(degrees) + this.heading);
      index++;
    }
  }


  getRayLengths(car, walls) {
    // Checks if there is a point where the ray intersects a wall and draws a line to that closest wall.
    let rayLengths = [];
    for (const i in this.rays) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (const wall of walls) {
        if (!wall.checkpoint) {
          const pt = ray.cast(car, wall);
          if (pt) {
            let d = p5.Vector.dist(this.pos, pt);
            const a = ray.dir.heading() - this.heading;
            d *= abs(cos(a));

            if (d < record) {
              record = d;
              closest = pt;
            }
          }
        }
      }
      rayLengths[i] = record;
      if (this === bestCar) {
        if (drawRays && closest) {
          this.drawRays(closest);
          if (drawRayLengths) {
            this.drawRayLengths(closest, record);
          }
        }
      }
    }
    return rayLengths;
  }


  drawRays(closest) {
    // Draw the lines coming from the car to the walls.
    push();
    stroke(255, 127);
    line(this.pos.x, this.pos.y, closest.x, closest.y);
    pop();
  }


  drawRayLengths(closest, record) {
    // Draw the distance of the lines centered on it as white, small text.
    push();
    fill(255);
    strokeWeight(0);
    text(Math.trunc(record), (this.pos.x + closest.x) / 2, (this.pos.y + closest.y) / 2);
    pop();
  }


  checkCrashed() {
    const lineFront = [this.pos.x, this.pos.y, this.pos.x + this.width, this.pos.y];
    const lineLeft = [this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.height];
    const lineRight = [this.pos.x + this.width, this.pos.y, this.pos.x + this.width, this.pos.y + this.height];
    const lineBack = [this.pos.x, this.pos.y + this.height, this.pos.x + this.width, this.pos.y + this.height];

    for (const wall of walls) {
      const chkLineFront = intersects(wall.a.x, wall.a.y, wall.b.x, wall.b.y, lineFront[0], lineFront[1], lineFront[2], lineFront[3]);
      const chkLineLeft = intersects(wall.a.x, wall.a.y, wall.b.x, wall.b.y, lineLeft[0], lineLeft[1], lineLeft[2], lineLeft[3]);
      const chkLineRight = intersects(wall.a.x, wall.a.y, wall.b.x, wall.b.y, lineRight[0], lineRight[1], lineRight[2], lineRight[3]);
      const chkLineBack = intersects(wall.a.x, wall.a.y, wall.b.x, wall.b.y, lineBack[0], lineBack[1], lineBack[2], lineBack[3]);

      if (chkLineFront || chkLineLeft || chkLineRight || chkLineBack) {
        if (!wall.checkpoint) {
          this.alive = false;
          savedCars.push(this); // Save the car.
          // break;
        } else {
          this.touchingCheckpoint = true;
          if (this.score >= this.checkpointCount) {
            this.score = 0;
            if (time < recordTime || !recordTime) {
              recordTime = time;
              startTime = performance.now();
            }
            this.laps++;
          }
          break;
        }
      } else
        this.touchingCheckpoint = false;
    }
  }


  firstPersonView(rayLengths) {
    const renderW = width / 2;
    const w = renderW / this.rays.length;
    push();
    translate(renderW, 0);
    for (const i in rayLengths) {
      const record = rayLengths[i];

      const sSq = pow(record, 2); // rayLengths distance^2
      const rWSq = pow(renderW / 2, 2); // renderWidth^2
      const b = map(sSq, 0, rWSq, 255, 0);
      const h = map(record, 0, 500, height, 0);

      fill(b);
      noStroke();
      rectMode(CENTER);
      rect(i * w + w / 2, height / 2, w + 1, h);
    }
    pop();
  }
}