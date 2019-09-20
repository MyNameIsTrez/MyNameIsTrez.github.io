class Enemy {
  constructor(_col, _row) {
    this.x = _col * tileSize + 0.5 * tileSize;
    this.y = _row * tileSize + 0.5 * tileSize;
    this.speed = 1;
    this.start = world[_col][_row];
    this.start.wall = false;
    this.openSet = [];
    this.closedSet = [];
    this.current;
  }

  show() {
    push();
    fill(255, 255, 0);
    strokeWeight(0.5);
    circle(this.x, this.y, tileSize / 2);
    pop();
  }

  pathfind(end) {
    this.openSet = []
    this.closedSet = []
    this.openSet.push(this.start);
    while (true) {
      if (this.openSet.length > 0) {
        // Look for the index of the tile with the lowest fScore.
        let currentIndex = 0; // Assume the first tile in openSet has the lowest fScore.
        for (let i = 0; i < this.openSet.length; i++) {
          if (this.openSet[i].f < this.openSet[currentIndex].f) {
            currentIndex = i;
          }
        }
        this.current = this.openSet[currentIndex];

        if (this.current === end) {
          // Found a solution!
          // If the enemy is in the same tile as the player.
          if (this.start === this.current) {
            console.log("The enemy is in the same tile as the player!")
          }
          return;
        }

        removeFromArray(this.openSet, this.current);
        this.closedSet.push(this.current);

        const neighbors = this.current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
          const neighbor = neighbors[i];

          if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
            // const tempG = this.current.g + 1; // Shouldn't this be sqrt(2) in some cases?
            const heur = heuristic(neighbor, this.current) / tileSize;
            const tempG = this.current.g + heur;

            let newPath = false;
            if (this.openSet.includes(neighbor)) {
              if (tempG < neighbor.g) {
                neighbor.g = tempG;
                newPath = true;
              }
            } else {
              neighbor.g = tempG;
              this.openSet.push(neighbor);
              newPath = true;
            }

            if (newPath) {
              neighbor.h = heuristic(neighbor, end);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = this.current;
            }
          }
        }
      } else {
        // No solution! The code should never reach this.
        console.error("The pathfinding algorithm got stuck!");
        return;
      }
    }
  }

  showSets() {
    for (let i = 0; i < this.closedSet.length; i++) {
      this.closedSet[i].show(color(255, 0, 0));
    }

    for (let i = 0; i < this.openSet.length; i++) {
      this.openSet[i].show(color(0, 255, 0));
    }
  }

  showPath() {
    // Find the path.
    const pathFromPlayer = [];
    let child = this.current;
    pathFromPlayer.push(child);
    while (child.parent) {
      pathFromPlayer.push(child.parent);
      child = child.parent;
    }

    const pathFromEnemy = [...pathFromPlayer].reverse();

    push();
    noFill();
    strokeWeight(3);
    stroke(255);
    beginShape();
    for (let i = 0; i < pathFromEnemy.length; i++) {
      pathFromEnemy[i].show(color(0, 0, 255));
      vertex(pathFromEnemy[i].col * tileSize + tileSize / 2,
        pathFromEnemy[i].row * tileSize + tileSize / 2);
    }
    endShape();
    pop();
  }
}