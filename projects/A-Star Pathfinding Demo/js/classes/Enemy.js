class Enemy {
  constructor(_col, _row, _id) {
    this.col = _col;
    this.row = _row;
    this.id = _id;

    this.speed = 1;
    this.openSet = [];
    this.closedSet = [];
    this.pathFromEnemy = [];

    // The current tile the enemy is standing on.
    this.current = world[_col][_row];
    this.current.wall = false;
    this.current.entity = this;

    this.x = this.current.col * tileSize + 0.5 * tileSize;
    this.y = this.current.row * tileSize + 0.5 * tileSize;

    // This is tileContainsPlayer once pathfind() has ran.
    this.furthest = undefined;

    this.type = 'enemy';
  }

  show() {
    push();
    // Draw the enemy circle.
    fill(255, 255, 0);
    strokeWeight(0.5);
    circle(this.x, this.y, tileSize / 2);
    // Draw the enemy ID.
    stroke(0);
    fill(255, 0, 0);
    textSize(10);
    text(this.id, this.x, this.y);
    pop();
  }

  move() {
    // If there is a next tile the enemy can move to.
    if (this.pathFromEnemy.length >= 2) {
      const next = this.pathFromEnemy[1];
      // We don't want enemies to merge into one,
      // so we check if the next tile isn't already occupied by a different enemy before we move.
      if (!next.entity) {
        if (frameCount % (60 / enemySpeed) === 0) {
          // Move the enemy one tile closer to the player.
          // Remove itself from the tile it's currently standing on.
          this.current.entity = undefined;
          // Update the current tile the enemy is standing on.
          this.current = next;
          this.current.entity = this;
          // We need to remove the parent from the next tile, as we want the new path to be shorter.
          this.current.parents[this.id] = null;
          // Update the x and y coordinates.
          this.x = this.current.col * tileSize + 0.5 * tileSize;
          this.y = this.current.row * tileSize + 0.5 * tileSize;
          // Get the next path.
          this.pathfind();
        } else {
          // Slide towards the next tile.
          if (slidingEnemies) {
            const xDiff = next.x - this.current.x;
            const yDiff = next.y - this.current.y;
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
    this.openSet.push(this.current);
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
          if (this.current === this.furthest) {
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
            const heur = heuristic(neighbor, this.furthest) / tileSize;
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
    // Find the path.
    const pathFromPlayer = [];
    let child = tileContainsPlayer;
    pathFromPlayer.push(child);

    while (child.parents[this.id]) {
      pathFromPlayer.push(child.parents[this.id]);
      child = child.parents[this.id];
    }

    this.pathFromEnemy = [...pathFromPlayer].reverse();
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
    strokeWeight(3);
    switch (this.id) {
      case 0:
        stroke(0, 255, 255, 100);
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
    for (let i = 0; i < this.pathFromEnemy.length; i++) {
      vertex(this.pathFromEnemy[i].col * tileSize + tileSize / 2,
        this.pathFromEnemy[i].row * tileSize + tileSize / 2);
    }
    endShape();
    pop();
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