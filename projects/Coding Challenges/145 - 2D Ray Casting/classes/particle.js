class Particle {
  constructor(rays) {
    this.pos = createVector(width / 2, height / 2);
    this.rays = [];

    // The amount of rays are determined by this for loop.
    for (let degrees = 0; degrees < 360; degrees += 360 / rays) {
      this.rays.push(new Ray(this.pos, degrees));
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  show() {
    // Draw the origin of the rays.
    push();
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4);
    pop();

    if (sourceIllumination) {
      // Draws the rays that don't hit a wall very short so you the particle looks brighter with more rays.
      for (const ray of this.rays) {
        ray.show();
      }
    }
  }

  look(walls) {
    // Checks if there is a point where the ray intersects a wall and draws a line to that closest wall.
    push();
    stroke(255);
    for (const ray of this.rays) {
      let closest = null;
      let record = Infinity;
      for (const wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      if (closest) {
        stroke(255, 127);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
    pop();
  }
}