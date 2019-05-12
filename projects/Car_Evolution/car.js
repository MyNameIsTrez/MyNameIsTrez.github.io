class Car {

  constructor(xStart, yStart, width, height, rotation, fov, rayCount) {
    this.startPos = createVector(xStart, yStart);
    this.pos = createVector(xStart, yStart);
    this.width = width;
    this.height = height;
    this.fov = fov;
    this.rayCount = rayCount;

    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.startHeading = radians(rotation) - PI / 2;
    this.heading = radians(rotation) - PI / 2; // Should really be a vector.
    this.touchingCheckpoint = false;
    this.points = 0;
    this.laps = 0;
    this.seeAnyCheckpointWall = false;
    this.seeCloseCheckpointWall = false;

    this.rays = [];
    // The number of created rays are determined by this for loop.
    for (let degrees = -this.fov / 2; degrees <= this.fov / 2; degrees += this.fov / this.rayCount)
      this.rays.push(new Ray(this.pos, radians(degrees) + this.heading));

    startTime = performance.now();


    this.checkpointCount = 0;
    for (const wall of walls) {
      if (wall.checkpoint)
        this.checkpointCount++;
    }
  }

  update() {
    let lastTouchingCheckpoint = this.touchingCheckpoint;
    this.checkCrashed();
    if (!lastTouchingCheckpoint && this.touchingCheckpoint)
      this.points++;

    this.vel.add(this.acc);
    this.acc.mult(0.7);
    this.pos.add(this.vel);
    this.vel.mult(0.9);

    const scene = this.look(walls);
      if (renderRayCasting) {
      push();
      translate(width/2, 0);
      noStroke();
      fill(0);
      rect(0, 0, width/2, height); // Why doesn't this work?
      pop();
      this.renderRaycast(scene);
    }
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    fill(255, 0, 0);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    pop();
  }

  updateFOV(fov) {
    this.fov = fov;
    this.rays = [];
    // The number of created rays are determined by this for loop.
    for (let degrees = -this.fov / 2; degrees <= this.fov / 2; degrees += this.fov / this.rayCount)
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
    for (let degrees = -this.fov / 2; degrees <= this.fov / 2; degrees += this.fov / this.rayCount) {
      this.rays[index].setAngle(radians(degrees) + this.heading);
      index++;
    }
  }

  look(walls) {
    // Checks if there is a point where the ray intersects a wall and draws a line to that closest wall.
    let scene = [];
    for (const i in this.rays) {
      const ray = this.rays[i];
      let closest = null;
      let recordWall = Infinity;
      let recordCheckpoint = Infinity;
      for (const wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt);
          const a = ray.dir.heading() - this.heading;
          d *= cos(a);

          if (d < recordWall && d < recordCheckpoint)
            closest = pt;

          if (d < recordWall) {
            if (wall.checkpoint && this.seeAnyCheckpointWall)
              this.seeCloseCheckpointWall = true;
            else
              recordWall = d;
          }

          if (d < recordCheckpoint)
            if (wall.checkpoint && this.seeAnyCheckpointWall) {
              this.seeCloseCheckpointWall = true;
              recordCheckpoint = d;
            }
        }
      }

      if (recordWall < recordCheckpoint)
        scene[i] = [recordWall, false];
      else
        scene[i] = [recordCheckpoint, true];

      if (closest) {
        push();

        if (this.seeCloseCheckpointWall && recordCheckpoint < recordWall) {
          stroke(0, 255, 0, 127);
          this.seeCloseCheckpointWall = false;
        } else if (recordWall)
          stroke(255, 127);

        // Draw the lines coming from the car to the walls with the record.
        line(this.pos.x, this.pos.y, closest.x, closest.y);
        fill(255);
        strokeWeight(0);
        if (this.seeCloseCheckpointWall && recordCheckpoint)
          text(Math.trunc(recordCheckpoint), (this.pos.x + closest.x) / 2, (this.pos.y + closest.y) / 2);
        else
          text(Math.trunc(recordWall), (this.pos.x + closest.x) / 2, (this.pos.y + closest.y) / 2);
        pop();
      }
    }
    return scene;
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
          this.dead();
          // break;
        } else {
          this.touchingCheckpoint = true;
          if (this.points >= this.checkpointCount) {
            this.points = 0;
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

  dead() {
    startTime = performance.now();
    generation++;
    this.pos.x = this.startPos.x;
    this.pos.y = this.startPos.y;
    this.heading = this.startHeading;
    this.vel = createVector(0, 0);
    this.points = 0;
    this.laps = 0;
    let index = 0;
    for (let degrees = -this.fov / 2; degrees <= this.fov / 2; degrees += this.fov / this.rayCount) {
      this.rays[index].setAngle(radians(degrees) + this.heading);
      index++;
    }
  }

  renderRaycast(scene) {
    const renderW = width / 2;
    const w = renderW / this.rays.length;
    push();
    translate(renderW, 0);
    for (const i in scene) {
      const record = scene[i][0];
      const checkpoint = scene[i][1];
      const maxRecordB = renderW / 2;

      const sSq = pow(record, 2); // scene^2
      const rWSq = pow(renderW, 2); // renderWidth^2
      const b = map(sSq, 0, rWSq, 255, 0);

      const maxRecordH = renderW;
      const h = map(record, 0, maxRecordH, height, 0);
      if (checkpoint)
        fill(0, b, 0);
      else
        fill(b);
      noStroke();
      rectMode(CENTER);
      rect(i * w + w / 2, height / 2, w + 1, h);
    }
    pop();
  }
}