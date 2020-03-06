class Enemy {
  constructor(_col, _row, _id) {
    this.col = _col;
    this.row = _row;
    this.id = _id;

    this.speed = tileSizeFull / 8;
    this.openSet = [];
    this.closedSet = [];
    this.pathFromEnemy = [];

    // The current tile the enemy is standing on.
    this.currentTile = world[_col][_row];
    this.currentTile.wall = false;
    this.currentTile.entity = this;

    this.x = this.currentTile.col * tileSizeFull + 0.5 * tileSizeFull;
    this.y = this.currentTile.row * tileSizeFull + 0.5 * tileSizeFull;

    // This is tileContainsPlayer once pathfind() has ran.
    this.furthest = undefined;

    this.type = 'enemy';

    this.health = 5;
  }

  show() {
    push();
    // Show the enemy circle.
    fill(255, 255, 0);
    if (fullView) {
      strokeWeight(0.5);
      circle(this.x, this.y, enemyCircleRadius);
    } else {
      const coords = getRestrictedViewCoords(this.x, this.y);
      strokeWeight(2);
      circle(coords.x, coords.y, enemyCircleRadius);
    }
    // Show the enemy ID.
    stroke(0);
    fill(255, 0, 0);
    if (fullView) {
      textSize(10);
      text(this.id, this.x, this.y);
    } else {
      textSize(10 * rows / restrictedViewDiameter);
      const coords = getRestrictedViewCoords(this.x, this.y);
      text(this.id, coords.x, coords.y);
    }
    pop();
  }

  move() {
    // If there is a next tile the enemy can move to.
    if (this.pathFromEnemy.length >= 2) {
      const next = this.pathFromEnemy[1];
      // We don't want enemies to be able to occupy the same tile,
      // so we check if the next tile isn't already occupied by a different enemy before we move.
      if (!next.entity) {
        // Move the enemy one tile closer to the player.
        if (frameCount % (60 / enemySpeed) === 0) {
          // Remove itself from the tile it's currently standing on.
          this.currentTile.entity = undefined;
          // Move the enemy and update the tile it's standing on.
          this.currentTile = next;
          this.currentTile.entity = this;
          // We need to remove the parent from the next tile, as we want the new path to be shorter.
          this.currentTile.parents[this.id] = null;
          // Update the x and y coordinates.
          this.x = this.currentTile.col * tileSizeFull + 0.5 * tileSizeFull;
          this.y = this.currentTile.row * tileSizeFull + 0.5 * tileSizeFull;
        } else {
          // Slide towards the next tile.
          if (slidingEnemies) {
            const xDiff = next.x - this.currentTile.x;
            const yDiff = next.y - this.currentTile.y;
            const slideFrames = (60 / enemySpeed);
            this.x += xDiff / slideFrames;
            this.y += yDiff / slideFrames;
          }
        }
      }
    }
  }

  pathfind() {
    this.openSet = [];
    this.closedSet = [];
    this.openSet.push(this.currentTile);
    while (true) {
      if (this.openSet.length > 0) {
        // Look for the index of the tile with the lowest fScore in openSet.
        let currentIndex = 0; // Assume the first tile in openSet has the lowest fScore at first.
        for (let i = 0; i < this.openSet.length; i++) {
          if (this.openSet[i].f[this.id] < this.openSet[currentIndex].f[this.id]) {
            currentIndex = i;
          }
        }
        this.furthest = this.openSet[currentIndex];

        // Found a solution!
        if (this.furthest === tileContainsPlayer) {
          // If the enemy is in the same tile as the player.
          if (this.currentTile === this.furthest) {
            // console.log(`Game over!\nYou survived for ${round(frameCount / 60)} seconds!`)
            // noLoop();
          }
          return;
        }

        removeFromArray(this.openSet, this.furthest);
        this.closedSet.push(this.furthest);

        const neighbors = this.furthest.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
          const neighbor = neighbors[i];

          if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
            // const tempG = this.furthest.g[this.id] + 1; // Shouldn't this be sqrt(2) in some cases?
            const heur = heuristic(neighbor, this.furthest) / tileSizeFull;
            let tempG;
            // If the 'g' property exists, add it. Otherwise, keep it as 0.
            if (this.furthest.g[this.id] + heur) {
              tempG = this.furthest.g[this.id] + heur;
            } else {
              tempG = heur;
            }

            let newPath = false;
            if (this.openSet.includes(neighbor)) {
              if (tempG < neighbor.g[this.id]) {
                neighbor.g[this.id] = tempG;
                newPath = true;
              }
            } else {
              neighbor.g[this.id] = tempG;
              this.openSet.push(neighbor);
              newPath = true;
            }

            if (newPath) {
              neighbor.h[this.id] = heuristic(neighbor, tileContainsPlayer);
              neighbor.f[this.id] = neighbor.g[this.id] + neighbor.h[this.id];
              neighbor.parents[this.id] = this.furthest;
            }
          }
        }
      } else {
        /*
        No solution! The program should never reach this part.
        I'm not even sure why I want this code here to be totally honest, if I'm not expecting this part to ever be reached.
        This part can be deleted at the end of this project once I've playtested a bunch.
        */
        console.error("One of the enemies couldn't find a path to the player! This code should never be reached!")
        return;
      }
    }
  }

  getPathFromEnemyToPlayer() {
    const pathFromPlayer = [];
    let child = tileContainsPlayer;
    pathFromPlayer.push(child);
    const arr = [];

    while (child.parents[this.id]) {
      // The problem here is that there are two tiles referencing each other as parents,
      // which causes an infinite while loop.
      if (arr.includes(child.parents[this.id])) {
        console.log(arr);
      }
      arr.push(child.parents[this.id]);
      pathFromPlayer.push(child.parents[this.id]);
      child = child.parents[this.id];
    }

    newWaveStarted = false;
    // Does pathFromEnemy contain this enemy tile? It ends at the player.
    this.pathFromEnemy = pathFromPlayer.reverse();
  }

  showClosedSet() {
    for (let i = 0; i < this.closedSet.length; i++) {
      this.closedSet[i].show(color(255, 0, 0));
    }
  }

  showOpenSet() {
    for (let i = 0; i < this.openSet.length; i++) {
      this.openSet[i].show(color(0, 255, 0));
    }
  }

  showPath() {
    push();
    noFill();
    switch (this.id) {
      case 0:
        stroke(0, 200, 200, 100);
        break;
      case 1:
        stroke(255, 0, 255, 100);
        break;
      case 2:
        stroke(255, 255, 0, 100);
        break;
      case 3:
        stroke(0, 0, 255, 100);
        break;
    }

    beginShape();
    if (fullView) {
      strokeWeight(2);
      for (let i = 0; i < this.pathFromEnemy.length; i++) {
        const x = this.pathFromEnemy[i].col * tileSizeFull + tileSizeFull / 2;
        const y = this.pathFromEnemy[i].row * tileSizeFull + tileSizeFull / 2;
        vertex(x, y);
      }
    } else {
      strokeWeight(4);
      for (let i = 0; i < this.pathFromEnemy.length; i++) {
        const _x = this.pathFromEnemy[i].col * tileSizeFull + tileSizeFull / 2;
        const _y = this.pathFromEnemy[i].row * tileSizeFull + tileSizeFull / 2;
        const coords = getRestrictedViewCoords(_x, _y);
        vertex(coords.x, coords.y);
      }
    }
    endShape();
    pop();
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.removeSelf();
    }
  }

  removeSelf() {
    const index = waveManager.enemies.indexOf(this);
    // If this enemy is in the waveManager's enemies array.
    if (index > -1) {
      // Remove itself as an entity reference from the tile it's currently standing on.
      this.currentTile.entity = undefined;
      
      // We need to remove all the parent tile references from this enemy to the player.
      // console.log(tileContainsPlayer);
      // console.log(this.pathFromEnemy);
      for (let i = 0; i < this.pathFromEnemy.length; i++) {
        this.pathFromEnemy[i].parents[this.id] = null;
      }
      
      // Remove itself from the waveManager's enemies array.
      waveManager.enemies.splice(index, 1);
    }
  }
}

function removeFromArray(array, element) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === element) {
      array.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  const d = dist(a.x, a.y, b.x, b.y);
  return d;
}