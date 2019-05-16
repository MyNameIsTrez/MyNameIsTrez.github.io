class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    // Create a vector pointing in the direction of the angle.
    this.dir = p5.Vector.fromAngle(angle);
  }

  // lookAt(x, y) {
  //   this.dir.x = x - this.pos.x;
  //   this.dir.y = y - this.pos.y;
  //   this.dir.normalize();
  // }

  setAngle(angle) {
    this.dir = p5.Vector.fromAngle(angle);
  }

  cast(car, wall) {
    // Line segment of the wall.
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    // Position of the ray.
    const x3 = this.pos.x;
    const y3 = this.pos.y;

    // Endpoint of the ray.
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      // The ray and boundary are parallel and thus never meet.
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      // If there is an intersection.
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);

      car.seeAnyCheckpointWall = wall.checkpoint;
      return pt;
    } else {
      // If there isn't an intersection.
      return;
    }
  }
}