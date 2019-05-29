// Editable.
let maxPosXYCount = 32;
let isometricView = true;
let shadows = true;

// TODO
// - Make the wool look better.
// - The controls should be clearer.
// - Instructions on how to use the .json file in Tekkit.



















// https://minecraft.gamepedia.com/Wool
let colors = [
  ['white', [221, 221, 221]],
  ['orange', [219, 125, 62]],
  ['magenta', [179, 80, 188]],
  ['light_blue', [107, 138, 201]],
  ['yellow', [177, 166, 39]],
  ['lime', [65, 174, 56]],
  ['pink', [208, 132, 153]],
  ['gray', [64, 64, 64]],
  ['light_gray', [154, 161, 161]],
  ['cyan', [46, 110, 137]],
  ['purple', [126, 61, 181]],
  ['blue', [46, 56, 141]],
  ['brown', [79, 50, 31]],
  ['green', [53, 70, 27]],
  ['red', [150, 52, 48]],
  ['black', [25, 22, 22]]
];

let woolTextures = [];
function preload() {
  for (color of colors) {
    woolTextures.push(loadImage('wool_textures/' + color[0] + '.png'));
  }
}

// Not editable; just making these variables global.
let walls;
let sliderPosXCount, sliderPosYCount;
let sliderBackgroundColor, sliderCursorColor;
let cursorIndex = 0;
let cursorColor = colors[cursorIndex][1];

let wallSize;
if (innerWidth < innerHeight) {
  wallSize = Math.trunc((innerWidth * 0.75) / maxPosXYCount);
} else {
  wallSize = Math.trunc((innerHeight * 0.75) / maxPosXYCount);
}

function setup() {
  sliderBackgroundColor = createColorPicker('#7ab7fa').input(update); // light blue
  createButton('isometric view').mousePressed(function () {
    isometricView = !isometricView;
  });
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
  if (isometricView && shadows) {
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
  }
}


function mouseAction() {
  const posX = floor((mouseX - wallSize) / wallSize);
  let posY;
  if (isometricView) {
    posY = floor((mouseY - wallSize) / wallSize);
  } else {
    posY = floor((mouseY - 2 * wallSize) / wallSize);
  }

  if (mouseButton === LEFT) {
    if (walls[posX][posY] && !Array.isArray(walls[posX][posY])) {
      walls[posX][posY].colorIndex = cursorIndex;
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
      cursorColor = colors[cursorIndex][1];
      break;
    case '2':
      cursorIndex = 1;
      cursorColor = colors[cursorIndex][1];
      break;
    case '3':
      cursorIndex = 2;
      cursorColor = colors[cursorIndex][1];
      break;
    case '4':
      cursorIndex = 3;
      cursorColor = colors[cursorIndex][1];
      break;
    case '5':
      cursorIndex = 4;
      cursorColor = colors[cursorIndex][1];
      break;
    case '6':
      cursorIndex = 5;
      cursorColor = colors[cursorIndex][1];
      break;
    case '7':
      cursorIndex = 6;
      cursorColor = colors[cursorIndex][1];
      break;
    case '8':
      cursorIndex = 7;
      cursorColor = colors[cursorIndex][1];
      break;
    case '9':
      cursorIndex = 8;
      cursorColor = colors[cursorIndex][1];
      break;
    case '0':
      cursorIndex = 9;
      cursorColor = colors[cursorIndex][1];
      break;
    case '!':
      cursorIndex = 10;
      cursorColor = colors[cursorIndex][1];
      break;
    case '@':
      cursorIndex = 11;
      cursorColor = colors[cursorIndex][1];
      break;
    case '#':
      cursorIndex = 12;
      cursorColor = colors[cursorIndex][1];
      break;
    case '$':
      cursorIndex = 13;
      cursorColor = colors[cursorIndex][1];
      break;
    case '%':
      cursorIndex = 14;
      cursorColor = colors[cursorIndex][1];
      break;
    case '^':
      cursorIndex = 15;
      cursorColor = colors[cursorIndex][1];
      break;
  }
}

class Wall {

  constructor(posX, posY, size, colorIndex) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.colorIndex = colorIndex;

    this.x = posX * size + size;
    this.y = posY * size + size * 2;
  }

  draw() {
    push();
    noStroke();
    // Top. (where you click in isometric view)
    if (isometricView) {
      image(woolTextures[this.colorIndex], this.x, this.y - this.size, this.size, this.size);
    }
    // Side. (actual tile position where you click in 2D view)
    if (isometricView) {
      tint(127);
    }
    image(woolTextures[this.colorIndex], this.x, this.y, this.size, this.size);
    pop();
  }

  drawShadows() {
    push();
    noStroke();
    // Shadow triangle below.
    fill(colors[this.colorIndex][1][0] * 0.25, colors[this.colorIndex][1][1] * 0.25, colors[this.colorIndex][1][2] * 0.25);
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
