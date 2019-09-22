class Player {
  constructor(_col, _row) {
    this.col = _col;
    this.row = _row;
    this.x = _col * tileSize + 0.5 * tileSize;
    this.y = _row * tileSize + 0.5 * tileSize;
    this.speed = 2; // The amount of pixels moved per frame of a key being held. Rounded up by a for loop.

    // The current tile the enemy is standing on.
    this.current = world[_col][_row];
    this.current.wall = false;
    this.current.entity = this;

    this.type = 'player';
  }

  show() {
    push();
    fill(0, 255, 255);
    if (fullWorldView) {
      strokeWeight(0.5);
      circle(this.x, this.y, tileSize / 2);
    } else {
      strokeWeight(2);
      const coords = getLimitedWorldViewCoordinates(this.x, this.y);
      circle(coords.x, coords.y, tileSizeRD / 2);
    }
    pop();
  }

  getTileContainsPlayer() {
    const col = floor(this.x / tileSize);
    const row = floor(this.y / tileSize);
    return world[col][row];
  }
}