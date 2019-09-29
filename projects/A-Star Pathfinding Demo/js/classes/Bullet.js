class Bullet {
  constructor(_x, _y, _rotation, _parentBullets) {
    this.x = _x;
    this.y = _y;
    this.rotation = _rotation;
    this.parentBullets = _parentBullets;

    this.speed = 10;
    this.length = 2;
    this.damage = 1;
  }

  update() {
    for (let _ = 0; _ < this.speed; _++) {
      const deltaX = cos(this.rotation);
      const deltaY = -sin(this.rotation);
      this.x += deltaX;
      this.y += deltaY;
    }

    this.outOfBounds();
    this.hit();
  }

  show() {
    push();
    stroke(181, 166, 66); // Brass.
    strokeWeight(2);

    const deltaX = cos(this.rotation) * this.length;
    const deltaY = -sin(this.rotation) * this.length;
    line(
      this.x, this.y,
      this.x + deltaX,
      this.y + deltaY
    );
    pop();
  }

  // Deletes this bullet if it gets out of bounds.
  outOfBounds() {
    const minX = this.x >= 0;
    const maxX = this.x < tileSizeFull * cols;
    const minY = this.y >= 0;
    const maxY = this.y < tileSizeFull * rows;

    if (!(minX && maxX && minY && maxY)) {
      this.removeSelf();
    }
  }

  hit() {
    // If the point of the bullet is in the same position as an enemy,
    // damage the enemy and remove the bullet.

    const deltaX = cos(this.rotation) * this.length;
    const deltaY = -sin(this.rotation) * this.length;
    const bulletTipX = this.x + deltaX;
    const bulletTipY = this.y + deltaY;

    for (const enemy of enemies) {
      if (dist(enemy.x, enemy.y, bulletTipX, bulletTipY) <= enemyCircleRadius) {
        // Hit!
        enemy.takeDamage(this.damage);
        this.removeSelf();
      }
    }
  }

  removeSelf() {
    const index = this.parentBullets.indexOf(this);
    if (index > -1) { // If this bullet is in parentBullets.
      this.parentBullets.splice(index, 1);
    }
  }
}