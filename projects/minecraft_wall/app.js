// Editable.
let maxPosXYCount = 32;
let shadows = true;

// TODO
// - Make the wool look better.
// - The controls should be clearer.
// - Instructions on how to use the .json file in Tekkit.



















// https://minecraft.gamepedia.com/Wool
let colors = [
  [221, 221, 221], // '#DDDDDD'
  [219, 125, 62], // 'DB7D3E'
  [179, 80, 188], // '#B350BC'
  [107, 138, 201], // '#6B8AC9'
  [177, 166, 39], // '#B1A627'
  [65, 174, 56], // '#41AE38'
  [208, 132, 153], // '#D08499'
  [64, 64, 64], // '#404040'
  [154, 161, 161], // '#9AA1A1'
  [46, 110, 137], // '#2E6E89'
  [126, 61, 181], // '#7E3DB5'
  [46, 56, 141], // '#2E388D'
  [79, 50, 31], // '#4F321F'
  [53, 70, 27], // '#35461B'
  [150, 52, 48], // '#963430'
  [25, 22, 22] // '#191616'
];

let wool;

function preload() {
  wool = loadImage('wool.png');
}

// Not editable; just making these variables global.
let walls;
let sliderPosXCount, sliderPosYCount;
let sliderBackgroundColor, sliderCursorColor;
let cursorIndex = 0;
let cursorColor = colors[cursorIndex];
let wallSize;
if (innerWidth < innerHeight) {
  wallSize = Math.trunc((innerWidth * 0.75) / maxPosXYCount);
} else {
  wallSize = Math.trunc((innerHeight * 0.75) / maxPosXYCount);
}

function setup() {

  sliderBackgroundColor = createColorPicker('#7ab7fa').input(update); // light blue
  createButton('shadows').mousePressed(function () {
    shadows = !shadows;
  });

  createCanvas(maxPosXYCount * wallSize + 3 * wallSize, maxPosXYCount * wallSize + 4 * wallSize);

  createWallsArray();

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
  update();
  push();
  textSize(50);
  fill(cursorColor);
  text(cursorIndex + 1, 20, 65);
  pop();
}


function update() {
  background(sliderBackgroundColor.color().levels);
  if (shadows) {
    for (const column of walls) {
      for (const wall of column) {
        if (wall && !Array.isArray(wall)) {
          wall.drawShadows();
        }
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
  for (let posX = 0; posX < maxPosXYCount; posX++) {
    walls.push([]);
    // for (let posY = 0; posY < maxPosXYCount; posY++) {
    //   walls[posX].push([]);
    // }
  }
}


function mouseAction() {
  const posX = floor((mouseX - wallSize) / wallSize);
  const posY = floor((mouseY - wallSize) / wallSize);

  if (mouseButton === LEFT) {
    if (walls[posX][posY] && !Array.isArray(walls[posX][posY])) {
      walls[posX][posY].rgb = cursorColor;
    } else {
      walls[posX][posY] = new Wall(posX, posY, wallSize, cursorIndex);
    }
  } else if (mouseButton === RIGHT) {
    if (walls[posX][posY] && !Array.isArray(walls[posX][posY])) {
      walls[posX][posY] = [];
    }
  }
}


function keyPressed() {
  switch (key) {
    case 's':
      savedWalls = [];
      for (let posX = 0; posX < maxPosXYCount; posX++) {
        savedWalls.push([]);
        for (let posY = 0; posY < maxPosXYCount; posY++) {
          if (!walls[posX][posY]) {
            savedWalls[posX][posY] = 0;
          } else {
            savedWalls[posX][posY] = walls[posX][posY].colorIndex + 1;
          }
        }
      }
      saveJSON(savedWalls);
      break;
  }

  switch (key) {
    case '1':
      cursorIndex = 0;
      cursorColor = colors[cursorIndex];
      break;
    case '2':
      cursorIndex = 1;
      cursorColor = colors[cursorIndex];
      break;
    case '3':
      cursorIndex = 2;
      cursorColor = colors[cursorIndex];
      break;
    case '4':
      cursorIndex = 3;
      cursorColor = colors[cursorIndex];
      break;
    case '5':
      cursorIndex = 4;
      cursorColor = colors[cursorIndex];
      break;
    case '6':
      cursorIndex = 5;
      cursorColor = colors[cursorIndex];
      break;
    case '7':
      cursorIndex = 6;
      cursorColor = colors[cursorIndex];
      break;
    case '8':
      cursorIndex = 7;
      cursorColor = colors[cursorIndex];
      break;
    case '9':
      cursorIndex = 8;
      cursorColor = colors[cursorIndex];
      break;
    case '0':
      cursorIndex = 9;
      cursorColor = colors[cursorIndex];
      break;
    case '!':
      cursorIndex = 10;
      cursorColor = colors[cursorIndex];
      break;
    case '@':
      cursorIndex = 11;
      cursorColor = colors[cursorIndex];
      break;
    case '#':
      cursorIndex = 12;
      cursorColor = colors[cursorIndex];
      break;
    case '$':
      cursorIndex = 13;
      cursorColor = colors[cursorIndex];
      break;
    case '%':
      cursorIndex = 14;
      cursorColor = colors[cursorIndex];
      break;
    case 'Dead': // ^
      cursorIndex = 15;
      cursorColor = colors[cursorIndex];
      break;
  }
}

class Wall {

  constructor(posX, posY, size, colorIndex) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.colorIndex = colorIndex;
    this.rgb = colors[colorIndex];

    this.x = posX * size + size;
    this.y = posY * size + size * 2;
  }

  draw() {
    push();
    noStroke();

    // Side (real tile).
    image(wool, this.x, this.y, this.size, this.size);
    fill(this.rgb[0] / 4 * 3, this.rgb[1] / 4 * 3, this.rgb[2] / 4 * 3, 256 / 4 * 2.5);
    rect(this.x, this.y, this.size, this.size);
    // Top.
    image(wool, this.x, this.y - this.size, this.size, this.size);
    fill(this.rgb[0], this.rgb[1], this.rgb[2], 256 / 4 * 2.5);
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

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});