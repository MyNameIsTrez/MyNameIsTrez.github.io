// Editable.
let wallDimensions = 32; // the count of walls in the width and height
let isometricView = false;
let shadows = true;

// TODO
// - The controls should be clearer.
// - Instructions on how to use the .json file in Tekkit.
// - Add the loading of pre-made saves as a drop-down.
// - Automate the replacement of '[' with '{' using RegEx.



















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
    woolTextures.push(loadImage('https://raw.githubusercontent.com/MyNameIsTrez/MyNameIsTrez.github.io/master/projects/minecraft_wall/wool_textures/' + color[0] + '.png'));
  }
}

// Not editable; just making these variables global.
let walls;
let sliderPosXCount, sliderPosYCount;
let sliderBackgroundColor, sliderCursorColor;
let cursorIndex = 0;

let wallSize;
if (innerWidth < innerHeight) {
  wallSize = Math.trunc((innerWidth * 0.75) / wallDimensions);
} else {
  wallSize = Math.trunc((innerHeight * 0.75) / wallDimensions);
}

function setup() {
  sliderBackgroundColor = createColorPicker('#7ab7fa').input(update); // light blue
  createButton('isometric view').mousePressed(function () {
    isometricView = !isometricView;
  });
  createButton('shadows').mousePressed(function () {
    shadows = !shadows;
  });

  createCanvas(wallDimensions * wallSize + 3 * wallSize, wallDimensions * wallSize + 4 * wallSize);

  createWallsArray();

  update();
}


function draw() {
  if (mouseIsPressed) {
    let mouseInCanvas;
    if (isometricView) {
      mouseInCanvas = mouseX > wallSize && mouseX < width - 2 * wallSize &&
        mouseY > wallSize && mouseY < height - 3 * wallSize;
    } else {
      mouseInCanvas = mouseX > wallSize && mouseX < width - 2 * wallSize &&
        mouseY > wallSize && mouseY < height - 2 * wallSize;
    }
    if (mouseInCanvas) {
      mouseAction();
    }
  }
  update();
  push();
  textSize(50);
  fill(colors[cursorIndex][1]);
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
  for (let posX = 0; posX < wallDimensions; posX++) {
    walls.push([]);
    for (let posY = 0; posY < wallDimensions; posY++) {
      walls[posX][posY] = 0;
    }
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
      walls[posX][posY] = 0;
    }
  }
}


function keyPressed() {
  switch (key) {
    case 's':
      // Make a 2D array which stores the index of the color wool from 1-16 at it's (x, y) position in this array.
      savedWalls = [];
      for (let posX = 0; posX < wallDimensions; posX++) {
        savedWalls.push([]);
        for (let posY = 0; posY < wallDimensions; posY++) {
          if (!walls[posX][posY]) {
            savedWalls[posX][posY] = 0;
          } else {
            savedWalls[posX][posY] = walls[posX][posY].colorIndex + 1;
          }
        }
      }

      // Count how often every color of wool is in the array and store it in a 1D array with 16 spots for objects.
      colorCount = [];
      for (column of savedWalls) {
        for (color of column) {
          if (colorCount[color]) {
            colorCount[color].amount++;
          } else {
            colorCount[color] = { 'color': color, 'amount': 1 };
          }
        }
      }

      colorCount.sort(function (a, b) {
        return b.amount - a.amount;
      });

      // intializing variables for index replacing
      let amount;
      let slot = 0;
      let colorToReplace;
      let columnIndex = 0;
      let amountTrack;

      // beginning for loop to iterate through all used wool and amounts 
      for (wool of colorCount) {
        // if statement to make sure empty spaces are not counted as a wool type
        if (wool !== undefined && wool.color != 0) {
          // color to replace variable is just to keep track of the color we are currently looking for
          colorToReplace = wool.color;
          // slot represents the slot in the turtle
          slot++
          // variable initialized to starting wool amount 
          // (the amount of wool use for the current color)
          amount = wool.amount;
          // initializing to keep track of when to begin new slot
          amountTrack = amount;

          // for loop to begin replacing the stored wall slots (1-16 these now represent colors)
          for (column of savedWalls) {
            // these index variables are used to access the array value
            indexColor = 0;

            // nested loop to go into next array layer
            for (number of column) {
              // if statement to be sure we have not depleted the wool amount and that we are
              // replacing the correct wool color
              if (amount > 0 && parseInt(number) == parseInt(colorToReplace)) {
                // applying the slot number of the wool color and subtracting
                // one, since we just used up a block
                savedWalls[columnIndex][indexColor] = slot;
                amount--

                // this if is used to check if we have depleted through 64
                if (amount <= amountTrack - 64) {
                  // we hit this if we have, add one to the slot and begin asigning
                  slot++;

                  // update amount tracked to keep track of total wool depleted
                  amountTrack = amount;
                }
              }
              // next color position
              indexColor++;
            }
            // next index for column
            columnIndex++;
          }
          // reset index for next column
          columnIndex = 0;
        }
      }
      // console.log(savedWalls);


      // const sortedSavedWalls = [];
      // for (let posX = 0; posX < wallDimensions; posX++) {
      //   sortedSavedWalls.push([]);
      //   for (let posY = 0; posY < wallDimensions; posY++) {
      //     sortedSavedWalls[posX][posY] = 0;
      //   }
      // }

      // let checkpointedSavedWalls = []; // 3D
      let encounteredSlots = [];
      // let curCheckpoint = 0;
      for (let posX = 0; posX < wallDimensions; posX++) {
        // checkpointedSavedWalls[curCheckpoint] = [];
        // checkpointedSavedWalls[curCheckpoint][posX] = [];
        // console.log(checkpointedSavedWalls);
        // start a new checkpoint
        // if (encounteredSlots.length === 9) {
        //   encounteredSlots = [];
        //   curCheckpoint++;
        // }
        // sort savedWalls from low to high
        for (let posY = 0; posY < wallDimensions; posY++) {
          const slot = savedWalls[posX][posY];
          // console.log(slot);
          if (slot > 0 && !encounteredSlots.includes(slot)) {
            encounteredSlots.push(slot);
            // sortedSavedWalls[posX][posY] = highestSlot;
            // checkpointedSavedWalls[curCheckpoint][posX][posY] = highestSlot;
          }
        }
      }
      console.log(encounteredSlots);

      newSavedWalls = savedWalls.slice();
      for (let posX = 0; posX < wallDimensions; posX++) {
        for (let posY = 0; posY < wallDimensions; posY++) {
          if (encounteredSlots.includes(savedWalls[posX][posY])) {
            var index = encounteredSlots.indexOf(savedWalls[posX][posY]);

            if (index !== -1) {
              newSavedWalls[posX][posY] = index;
            }
          }
        }
      }
      // console.log(savedWalls);
      // console.log(newSavedWalls);
      // console.log(savedWalls === newSavedWalls);
      // for (let posX = 0; posX < wallDimensions; posX++) {
      //   console.log(savedWalls[posX] === newSavedWalls[posX]);
      // }
      // console.log(checkpointedSavedWalls);
      // console.log(sortedSavedWalls);

      // saveJSON(savedWalls);
      break;
  }

  let validKeys = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '0': 9, '!': 10, '@': 11, '#': 12, '$': 13, '%': 14, '^': 15, 'Dead': 15 };

  if (key in validKeys) {
    cursorIndex = parseInt(validKeys[key]);
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
    // Side. (actual tile position, you click here in 2D view)
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
