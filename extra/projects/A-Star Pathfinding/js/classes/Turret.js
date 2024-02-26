class Turret {
  constructor(_col, _row) {
    this.col = _col;
    this.row = _row;
    this.x = (this.col + 0.5) * tileSizeFull;
    this.y = (this.row + 0.5) * tileSizeFull;

    this.diameter = tileSizeFull / 1.25;
    this.radius = this.diameter / 2;
    this.rotation = Math.PI / 2;
    this.range = 50;
    this.trackingEnemy = undefined;
    this.fireRate = 0.5; // How many seconds the turret has to wait before it can refire.
    this.timeOfLastFiring = null;
    this.bullets = [];
  }

  update() {
    this.scanForEnemy();

    if (this.trackingEnemy) {
      this.rotateToEnemy();
      if (performance.now() / 1000 - this.timeOfLastFiring >= this.fireRate) {
        this.fire();
        this.timeOfLastFiring = performance.now() / 1000;
      }
    }
  }

  show() {
    push();
    // Show the range of the turret.
    noStroke();
    fill(0, 255, 0, 50);
    circle(this.x, this.y, this.range * 2)

    // Show the base of the turret.
    stroke(0);
    fill(150, 150, 150);
    strokeWeight(tileSizeFull / 16);
    circle(this.x, this.y, this.diameter);

    // Show the top of the turret.
    const deltaX = cos(this.rotation) * this.radius;
    const deltaY = -sin(this.rotation) * this.radius;
    strokeWeight(tileSizeFull / 16);
    line(
      this.x, this.y,
      this.x + deltaX,
      this.y + deltaY
    );
    pop();
  }

  scanForEnemy() {
    let smallestDistance = this.range;
    let smallestDistanceEnemy;
    for (const enemy of waveManager.enemies) {
      const distance = dist(enemy.x, enemy.y, this.x, this.y);
      if (distance <= smallestDistance) {
        smallestDistance = distance;
        smallestDistanceEnemy = enemy;
      }
    }
    this.trackingEnemy = smallestDistanceEnemy;
  }

  rotateToEnemy() {
    const deltaX = this.trackingEnemy.x - this.x;
    const deltaY = this.trackingEnemy.y - this.y;
    this.rotation = Math.atan2(deltaX, deltaY) - Math.PI / 2;
  }

  fire() {
    const x = this.x + cos(this.rotation) * this.radius;
    const y = this.y - sin(this.rotation) * this.radius;
    const bullet = new Bullet(x, y, this.rotation, this.bullets);
    this.bullets.push(bullet);
  }
}