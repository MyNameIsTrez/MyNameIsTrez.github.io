// Made by Sander Bos

// Editable.
let wallSize = 50; // 50 is the default.





















// Not editable; just making these variables global.
let walls;
let maxPosXCount = Math.trunc((innerWidth - 150) / wallSize),
  maxPosYCount = Math.trunc((innerHeight - 240) / wallSize);
let sliderPosXCount, sliderPosYCount;
let sliderBackgroundColor, sliderCursorColor;


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
      console.log(1);
    } else {
      walls[posX][posY] = new Wall(posX, posY, wallSize, sliderCursorColor.color().levels);
    }
    update();
  } else if (mouseButton === RIGHT) {
    if (walls[posX][posY] && !Array.isArray(walls[posX][posY])) {
      walls[posX][posY] = [];
    }
    update();
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
    // Shadow triangle below. 1 wide and 0.75 high.
    fill(this.rgb[0] * 0.25, this.rgb[1] * 0.25, this.rgb[2] * 0.25);
    triangle(this.x, this.y + this.size, this.x + this.size, this.y + this.size, this.x + this.size, this.y + this.size * 1.75);
    // Shadow rectangle below to the right. 1 wide and 0.75 high.
    rect(this.x + this.size, this.y + this.size, this.size, this.size * 0.75);
    // Shadow half rectangle to the right. 1 wide and 0.5 high.
    rect(this.x + this.size, this.y + this.size * 0.5, this.size, this.size * 0.5);
    // Shadow triangle to the right. 1 wide and 1 high.
    triangle(this.x + this.size, this.y - this.size * 0.5, this.x + this.size, this.y + this.size * 0.5, this.x + this.size * 2, this.y + this.size * 0.5);
    pop();
  }

}


window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});