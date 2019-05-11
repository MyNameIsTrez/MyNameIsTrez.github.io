class Car {

  constructor(xStart, yStart, width, height, rotation, fov, rayCount) {
    this.startPos = createVector(xStart, yStart);
    this.pos = createVector(xStart, yStart);
    this.width = width;
    this.height = height;
    this.fov = fov;
    this.rayCount = rayCount;

    this.vel = createVector(0, 0);
    this.startHeading = radians(rotation) - PI / 2;
    this.heading = radians(rotation) - PI / 2;
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

    this.pos.add(this.vel);
    this.vel.mult(0.97);

    this.look(walls);
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

  thrust() {
    const force = p5.Vector.fromAngle(this.heading);
    force.mult(0.06);
    this.vel.add(force);
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
    for (const ray of this.rays) {
      let closest = null;
      let record = Infinity;
      for (const wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            record = d;
            if (wall.checkpoint && this.seeAnyCheckpointWall)
              this.seeCloseCheckpointWall = true;
            closest = pt;
          }
        }
      }

      if (closest) {
        push();
        
        if (this.seeCloseCheckpointWall) {
          stroke(0, 255, 0, 127);
          this.seeCloseCheckpointWall = false;
        } else
          stroke(255, 127);
        
        line(this.pos.x, this.pos.y, closest.x, closest.y);
        fill(255);
        strokeWeight(0);
        text(Math.trunc(record), (this.pos.x + closest.x) / 2, (this.pos.y + closest.y) / 2);
        pop();
      }
    }
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
}