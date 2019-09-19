function pathfind(end) {
  openSet = []
  closedSet = []
  openSet.push(start);
  while (true) {
    if (openSet.length > 0) {
      // Look for the index of the Tile with the lowest fScore.
      let currentIndex = 0; // Assume the first Tile in openSet has the lowest fScore.
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[currentIndex].f) {
          currentIndex = i;
        }
      }
      current = openSet[currentIndex];

      if (current === end) {
        // Found a solution!
        return;
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      const neighbors = current.neighbors;
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];

        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          // const tempG = current.g + 1; // Shouldn't this be sqrt(2) in some cases?
          const heur = heuristic(neighbor, current) / tileSize;
          const tempG = current.g + heur;

          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            openSet.push(neighbor);
            newPath = true;
          }

          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = current;
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

function showSets() {
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }
}

function showPath() {
  // Find the path.
  pathFromPlayer = [];
  let child = current;
  pathFromPlayer.push(child);
  while (child.parent) {
    pathFromPlayer.push(child.parent);
    child = child.parent;
  }

  pathFromEnemy = [...pathFromPlayer].reverse();

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