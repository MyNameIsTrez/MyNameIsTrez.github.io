class Player {
  constructor(_col, _row) {
    this.col = _col;
    this.row = _row;
    this.x = (_col + 0.5) * tileSizeFull;
    this.y = (_row + 0.5) * tileSizeFull;
    this.speed = 2; // The amount of pixels moved per frame of a key being held. Rounded up by a for loop.

    // The current tile the enemy is standing on.
    this.current = world[_col][_row];
    this.current.wall = false;
    this.current.entity = this;

    this.type = 'player';
  }

  changeX(x) {
    this.x += x;
    this.col = floor(this.x / tileSizeFull);
  }

  changeY(y) {
    this.y += y;
    this.row = floor(this.y / tileSizeFull);
  }

  show() {
    push();
    fill(0, 255, 255);
    if (fullView) {
      strokeWeight(0.5);
      circle(this.x, this.y, tileSizeFull / 2);
    } else {
      strokeWeight(2);
      const coords = getRestrictedViewCoords(this.x, this.y);
      circle(coords.x, coords.y, tileSizeRestricted / 2);
    }
    pop();
  }

  getTileContainsPlayer() {
    const col = floor(this.x / tileSizeFull);
    const row = floor(this.y / tileSizeFull);
    return world[col][row];
  }
}