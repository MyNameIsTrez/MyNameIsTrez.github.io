// Made by Sander Bos

// Editable.
let isometricWallSize = 50; // 50 is the default.





















// Not editable; just making these variables global.
// let isometricWalls;
let maxPosXCount = Math.trunc((innerWidth - 150) / isometricWallSize),
  maxPosYCount = Math.trunc((innerHeight - 240) / isometricWallSize);
let sliderPosXCount, sliderPosYCount;
let sliderBackgroundColor, sliderCursorColor;


function updateIsometricShadows() {
  for (const column of isometricWalls) {
    for (const isometricWall of column) {
      if (isometricWall && !Array.isArray(isometricWall)) {
        isometricWall.drawShadows();
      }
    }
  }
}

function updateIsometricWallsSide() {
  for (const column of isometricWalls) {
    for (const isometricWall of column) {
      if (isometricWall && !Array.isArray(isometricWall)) {
        isometricWall.drawSide();
      }
    }
  }
}

function updateIsometricWallsTop() {
  for (const column of isometricWalls) {
    for (const isometricWall of column) {
      if (isometricWall && !Array.isArray(isometricWall)) {
        isometricWall.drawTop();
      }
    }
  }
}


function updateIsometricWallsMinimal() {
  for (const column of isometricWalls) {
    for (const isometricWall of column) {
      if (isometricWall && !Array.isArray(isometricWall)) {
        isometricWall.drawSide();
      }
    }
  }
}


// function createisometricWallsArray() {
//   isometricWalls = [];
//   for (let posX = 0; posX < maxPosXCount; posX++) {
//     isometricWalls.push([]);
//     for (let posY = 0; posY < maxPosYCount; posY++) {
//       isometricWalls[posX].push([]);
//     }
//   }
// }


function mouseAction() {
  const posX = floor((mouseX - isometricWallSize) / isometricWallSize);
  const posY = floor((mouseY - isometricWallSize) / isometricWallSize);

  if (mouseButton === LEFT) {
    if (isometricWalls[posX][posY] && !Array.isArray(isometricWalls[posX][posY])) {
      isometricWalls[posX][posY].rgb = sliderCursorColor.color().levels;
    } else {
      isometricWalls[posX][posY] = new IsometricWall(posX, posY, isometricWallSize, sliderCursorColor.color().levels);
    }
    if (state === 'race') {
      updateIsometricWalls();
    }
  } else if (mouseButton === RIGHT) {
    if (isometricWalls[posX][posY] && !Array.isArray(isometricWalls[posX][posY])) {
      isometricWalls[posX][posY] = [];
    }
    if (state === 'race') {
      updateIsometricWalls();
    }
  }
}


class IsometricWall {

  constructor(posX, posY, size, rgb) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.rgb = rgb;

    this.x = posX * size + size;
    this.y = posY * size + size * 2;
  }

  drawSide() {
    push();
    noStroke();
    // Side (real tile).
    fill(this.rgb[0] / 4 * 3, this.rgb[1] / 4 * 3, this.rgb[2] / 4 * 3);
    rect(this.x, this.y, this.size, this.size);
    pop();
  }

  drawTop() {
    push();
    noStroke();
    // Top.
    fill(this.rgb);
    rect(this.x, this.y - this.size, this.size, this.size);
    pop();
  }

  drawShadows() {
    push();
    noStroke();
    // Shadow triangle below.
    fill(this.rgb[0] * 0.25, this.rgb[1] * 0.25, this.rgb[2] * 0.25);
    triangle(this.x, this.y + this.size, this.x + this.size, this.y + this.size, this.x + this.size, this.y + this.size * 1.75);
    // Shadow rectangle below to the right.
    rect(this.x + this.size, this.y + this.size, this.size, this.size * 0.75);
    // Shadow half rectangle below to the right.
    rect(this.x + this.size, this.y + this.size / 2, this.size, this.size * 0.5);
    // Shadow triangle to the right.
    triangle(this.x + this.size, this.y - this.size * 0.5, this.x + this.size, this.y + this.size * 0.5, this.x + this.size * 2, this.y + this.size * 0.5);
    pop();
  }

}