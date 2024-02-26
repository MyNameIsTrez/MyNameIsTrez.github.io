class Particle {
  constructor(rays) {
    this.pos = createVector(width / 2, height / 2);
    this.rays = [];

    // The amount of rays are determined by this for loop.
    for (let degrees = 0; degrees < 360; degrees += 360 / (2 ** rays)) {
      this.rays.push(new Ray(this.pos, degrees));
    }
    // console.log("ray count: " + this.rays.length);
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  show() {
    // Draw the origin of the rays.
    push();
    fill(255, 127);
    ellipse(this.pos.x, this.pos.y, 4);
    pop();

    if (sourceIllumination) {
      // Draws the rays that don't hit a wall very short so the particle looks brighter with more rays.
      for (const ray of this.rays) {
        ray.show();
      }
    }
  }

  drawRays(walls) {
    // Checks if there is a point where the ray intersects a wall and draws a line to that closest wall.
    push();
    stroke(255);
    let i = 0;
    for (const ray of this.rays) {
      i++;
      // Look at reflections of the ray against walls.
      let lastClosest = null,
        lastWall = null;
      let prevAngle = 0;
      const dir = ray.dir;

      for (let ref = 0; ref <= reflectionCountSlider.value(); ref++) {
        const [closest, hitWall] = this.getClosestIntersection(ray, lastWall);

        // If there is a wall to reflect with.
        if (closest) {
          if (ref === 0) {
            line(this.pos.x, this.pos.y, closest.x, closest.y);
          } else {
            line(lastClosest.x, lastClosest.y, closest.x, closest.y);
          }

          lastClosest = closest;
          ray.pos.set(closest.x, closest.y);

          const angle = getAngleBetween(ray.dir, hitWall.dir);
          // console.log(isNaN(angle))
          prevAngle -= isNaN(angle) ? PI : 2 * angle;
          console.log(degrees(prevAngle));
          ray.dir = p5.Vector.fromAngle(prevAngle);
          lastWall = hitWall;
        } else {
          break;
        }
      }
      ray.pos = createVector(this.pos.x, this.pos.y);
      ray.dir = dir;
    }
    pop();
  }

  getClosestIntersection(ray, lastWall) {
    let closest = null;
    let hitWall = null;
    let record = Infinity;
    for (const wall of walls) {
      if (wall !== lastWall) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(ray.pos, pt);
          if (d < record) {
            record = d;
            closest = pt;
            hitWall = wall;
          }
        }
      }
    }
    return [closest, hitWall];
  }
}

function getAngleBetween(vect1, vect2) {
  let s1 = vect1.y / vect1.x;
  let s2 = vect2.y / vect2.x;
  return atan((s1 - s2) / (1 + s1 * s2));
}