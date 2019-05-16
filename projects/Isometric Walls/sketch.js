// Made by Sander Bos

// Editable.
let wallSize = 50; // 50 is the default.
let showPlayer = false;





















// Not editable; just making these variables global.
let walls;
let maxPosXCount = Math.trunc((innerWidth - 150) / wallSize),
  maxPosYCount = Math.trunc((innerHeight - 240) / wallSize);
let sliderPosXCount, sliderPosYCount;
let sliderBackgroundColor, sliderCursorColor;
let player;


function setup() {

  sliderBackgroundColor = createColorPicker([122, 183, 250]).input(update);
  sliderCursorColor = createColorPicker('white').input(update);

  createCanvas(maxPosXCount * wallSize + 3 * wallSize, maxPosYCount * wallSize + 4 * wallSize);

  createWallsArray();

  // Custom walls.
  // if (maxPosXCount >= 10 && maxPosYCount >= 5) {
  //   walls[7][0] = new Wall(7, 0, wallSize, color('orange').levels);
  //   walls[8][0] = new Wall(8, 0, wallSize, color('orange').levels);
  //   walls[7][4] = new Wall(7, 4, wallSize, color('white').levels);
  //   walls[8][4] = new Wall(8, 4, wallSize, color('white').levels);
  //   walls[9][4] = new Wall(9, 4, wallSize, color('white').levels);
  //   walls[2][3] = new Wall(2, 3, wallSize, color('magenta').levels);
  //   walls[3][3] = new Wall(3, 3, wallSize, color('magenta').levels);
  // }

  if (showPlayer) {
    player = new Player(0, 1, wallSize, color('red').levels);
  }

  update();

}


function draw() {
  if (mouseIsPressed) {
    const mouseInCanvas = mouseX > wallSize && mouseX < width - 2 * wallSize &&
      mouseY > wallSize && mouseY < height - 3 * wallSize;

    if (mouseInCanvas) {
      mouseAction();
    }
  }
}


function update() {
  background(sliderBackgroundColor.color().levels);
  if (showPlayer) {
    if (player.zIndex === 0) {
      for (const column of walls) {
        for (const wall of column) {
          if (wall && !Array.isArray(wall)) {
            wall.drawShadows();
          }
        }
      }

      player.drawShadow();
      player.draw();

      for (const column of walls) {
        for (const wall of column) {
          if (wall && !Array.isArray(wall)) {
            wall.draw();
          }
        }
      }
    } else {
      for (const column of walls) {
        for (const wall of column) {
          if (wall && !Array.isArray(wall)) {
            wall.drawShadows();
          }
        }
      }

      for (const column of walls) {
        for (const wall of column) {
          if (wall && !Array.isArray(wall)) {
            wall.draw();
          }
        }
      }

      player.drawShadow();
      player.draw();
    }
  } else {
    for (const column of walls) {
      for (const wall of column) {
        if (wall && !Array.isArray(wall)) {
          wall.drawShadows();
        }
      }
    }

    for (const column of walls) {
      for (const wall of column) {
        if (wall && !Array.isArray(wall)) {
          wall.draw();
        }
      }
    }
  }
}


function createWallsArray() {
  walls = [];
  for (let posX = 0; posX < maxPosXCount; posX++) {
    walls.push([]);
    for (let posY = 0; posY < maxPosYCount; posY++) {
      walls[posX].push([]);
    }
  }
}


function mouseAction() {
  const posX = floor((mouseX - wallSize) / wallSize);
  const posY = floor((mouseY - wallSize) / wallSize);

  if (mouseButton === LEFT) {
    if (walls[posX][posY] && !Array.isArray(walls[posX][posY])) {
      walls[posX][posY].rgb = sliderCursorColor.color().levels;
    } else {
      walls[posX][posY] = new Wall(posX, posY, wallSize, sliderCursorColor.color().levels);
      if (showPlayer) {
        if (player.posX === posX && player.posY === posY) {
          player.zIndex = 1;
        }
      }
    }
    update();
  } else if (mouseButton === RIGHT) {
    if (walls[posX][posY] && !Array.isArray(walls[posX][posY])) {
      walls[posX][posY] = [];
      if (showPlayer) {
        if (player.posX === posX && player.posY === posY) {
          player.zIndex = 0;
        }
      }
    }
    update();
  }
}


function keyPressed() {
  if (showPlayer) {
    switch (key) {
      case 'w':
        // If not at the top edge.
        if (walls[player.posX][player.posY - 1]) {
          player.posY--;
          player.y -= player.size;
          if (walls[player.posX][player.posY] === undefined || Array.isArray(walls[player.posX][player.posY])) {
            // If there is no wall above.
            player.zIndex = 0;
          } else {
            // If there is a wall.
            player.zIndex = 1;
          }
          update();
        }
        break;
      case 'a':
        // If not at the left edge.
        if (walls[player.posX - 1]) {
          player.posX--;
          player.x -= player.size;
          if (walls[player.posX][player.posY] === undefined || Array.isArray(walls[player.posX][player.posY])) {
            // If there is no wall to the left.
            player.zIndex = 0;
          } else {
            // If there is a wall.
            player.zIndex = 1;
          }
          update();
        }
        break;
      case 's':
        // If not at the bottom edge.
        if (walls[player.posX][player.posY + 1]) {
          player.posY++;
          player.y += player.size;
          if (walls[player.posX][player.posY] === undefined || Array.isArray(walls[player.posX][player.posY])) {
            // If there is no wall below.
            player.zIndex = 0;
          } else {
            // If there is a wall.
            player.zIndex = 1;
          }
          update();
        }
        break;
      case 'd':
        // If not at the right edge.
        if (walls[player.posX + 1]) {
          player.posX++;
          player.x += player.size;
          if (walls[player.posX][player.posY] === undefined || Array.isArray(walls[player.posX][player.posY])) {
            // If there is no wall to the right.
            player.zIndex = 0;
          } else {
            // If there is a wall.
            player.zIndex = 1;
          }
          update();
        }
        break;
    }
  }
}


class Wall {

  constructor(posX, posY, size, rgb) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.rgb = rgb;

    this.x = posX * size + size;
    this.y = posY * size + size * 2;
  }

  draw() {
    push();
    noStroke();

    // Side (real tile).
    fill(this.rgb[0] / 4 * 3, this.rgb[1] / 4 * 3, this.rgb[2] / 4 * 3);
    rect(this.x, this.y, this.size, this.size);
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


class Player {

  constructor(posX, posY, size, rgb) {
    this.posX = posX;
    this.posY = posY
    this.size = size;
    this.rgb = rgb;

    this.x = posX * size + size;
    this.y = posY * size + size * 2;
    this.zIndex = 0;
  }

  draw() {
    push();
    noStroke();
    fill(this.rgb);
    circle(this.x + this.size / 2, this.y + this.size / 2 - this.zIndex * this.size, this.size / 2 / 10 * 9);
    // this.x + size/2 + (this.size-this.size/10*9)/2
    pop();
  }

  drawShadow() {
    push();
    noStroke();
    fill(this.rgb[0] * 0.25, this.rgb[1] * 0.25, this.rgb[2] * 0.25);
    circle(this.x + this.size / 2 + (this.size - this.size / 10 * 9) / 2, this.y + this.size / 2 + (this.size - this.size / 10 * 9) / 2 - this.zIndex * this.size, this.size / 2 / 10 * 9);
    pop();
  }

}


window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});