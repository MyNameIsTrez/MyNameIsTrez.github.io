// left-click to place/remove cells,
// press `p` to playing/pause the simulation

// Game of Life implementation inspiration from:
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life



// editable
let _frameRate = 60; // the framerate of the game
let cellTickRate = 1; // the rate at which cells are ticked
let cell_width_height = 35; // the width and height of each cell in pixels
let cell_width_count = 10; // the amount of cells in the width
let cell_height_count = 10; // the amount of cells in the height
let mode = `game_of_life`; // the game mode, default: game_of_life

let background_color = [239]; // the background color
let stroke_color = [193]; // the stroke color
let cursor_color = [0, 127, 0]; // the cursor color

const saves = {
  // name: [cellTickRate, cell_width_height, cell_width_count, cell_height_count, first cell-alive state, [length of cells with the same cell-alive states]]
  r_pentomino: [60, 5, 100, 100, 0, [4952, 2, 97, 2, 99, 1]],
  blinker: [6, 25, 10, 10, 0, [43, 3]],
  glider: [6, 25, 10, 10, 0, [13, 1, 7, 1, 1, 1, 8, 2]],
  toad: [6, 25, 6, 6, 0, [14, 3, 2, 3]],
  gosper_glider_gun: [12, 20, 38, 20, 0, [63, 1, 35, 1, 1, 1, 25, 2, 6, 2, 12, 2, 13, 1, 3, 1, 4, 2, 12, 2, 2, 2, 8, 1, 5, 1, 3, 2, 16, 2, 8, 1, 3, 1, 1, 2, 4, 1, 1, 1, 23, 1, 5, 1, 7, 1, 24, 1, 3, 1, 34, 2]]
}

// adds the user-made saves from the localStorage to the `saves` object
const storageSaves = JSON.parse(localStorage.getItem(`GOL_saves`));
for (const save in storageSaves) {
  saves[save] = storageSaves[save];
}

let game_width = cell_width_height * cell_width_count;
let game_height = cell_width_height * cell_height_count;
let canvas_height = game_height + 100;

// non-editable
let
  cells = [],
  playing = false,
  first_cell_alive,
  input_load,
  button_load,
  input_save,
  button_save,
  inputFolder = `saves`,
  cursor;

function setup() {
  frameRate(_frameRate)
  /*c=*/
  createCanvas(game_width + 1, canvas_height + 1); // `+ 1` is needed to show the bottom and right strokes
  // document.getElementById(id).append({canvas}.elt);
  for (let y = 0; y < cell_height_count; y++) {
    for (let x = 0; x < cell_width_count; x++) {
      cell = new Cell(x * cell_width_height, y * cell_width_height, cells.length);
      cells.push(cell)
    }
  }

  cursor = new Cursor();

  create_inputs();
  create_buttons();
}

function draw() {
  background(background_color);

  if (frameCount % (_frameRate / cellTickRate) === 0) { // limits the cells to the cellTickRate
    for (let cell in cells) {
      cells[cell].neighbours();
    }
    for (let cell in cells) {
      cells[cell].calculate();
    }
  }

  for (let cell in cells) {
    cells[cell].draw();
  }

  if (!playing) {
    cursor.draw();
  }

  if (mouseIsPressed) {
    if (mouseX > 0 && mouseX < game_width && mouseY > 0 && mouseY < game_height) {
      cells[floor(mouseX / cell_width_height) + floor(mouseY / cell_width_height) * cell_width_count].alive = first_cell_alive ? 0 : 1;
    }
  }

  // create the boundary box for the `Playing: true` text
  push();
  noFill();
  stroke(stroke_color);
  rect(0, game_height, game_width, canvas_height - game_height);
  pop();

  // create the `Playing: true` text
  push();
  textSize(24);
  if (playing) {
    fill(0, 191, 0);
  } else {
    fill(255, 0, 0);
  }
  text(`Playing: ` + playing, width / 2 - (`Playing: ` + playing).length * 5, canvas_height - 40);
  pop();
}

function load_game() {
  if (input_load.value() in saves) {
    // name: [cellTickRate, cell_width_height, cell_width_count, cell_height_count, first cell state, [cell-alive booleans]]
    cellTickRate = saves[input_load.value()][0];
    cell_width_height = saves[input_load.value()][1];
    cell_width_count = saves[input_load.value()][2];
    cell_height_count = saves[input_load.value()][3];

    game_width = cell_width_height * cell_width_count;
    game_height = cell_width_height * cell_height_count;
    canvas_height = game_height + 100;
    playing = false;
    cells = [];
    createCanvas(game_width + 1, canvas_height + 1); // `+ 1` is needed to show the bottom and right strokes

    for (let y = 0; y < cell_height_count; y++) {
      for (let x = 0; x < cell_width_count; x++) {
        const cell = new Cell(x * cell_width_height, y * cell_width_height, cells.length);
        cells.push(cell)
      }
    }

    let alive = saves[input_load.value()][4]; // the starting cell`s alive state
    let cell = 0;
    for (const size of saves[input_load.value()][5]) {
      for (let i = 0; i < size; i++) {
        cells[cell++].alive = alive ? 1 : 0;
      }
      alive = !alive;
    }

    input_load.position(game_width / 2 - input_load.width / 2 - 83 / 2, canvas_height + 15);
    input_save.position(game_width / 2 - input_load.width / 2 - 83 / 2, canvas_height + 15 + 25);

    button_load.position(input_load.x + input_load.width + 5, input_load.y);
    button_save.position(input_save.x + input_save.width + 5, input_save.y);

    cursor.x = 0;
    cursor.y = 0;
  } else {
    console.error(`Enter one of the available names to load:`, Object.keys(saves));
  }
}

function save_game() {
  if (!input_save.value()) {
    throw `Error: You need to enter your save name!`;
  }
  if (input_save.value() in saves) {
    throw `Error: A save with that name already exists.`;
  }
  let aliveCells = [];
  // push the game's settings and the cell-alive state of the first cell
  aliveCells.push(cellTickRate, cell_width_height, cell_width_count, cell_height_count, cells[0].alive, []);
  let length = 1;
  for (let cell in cells) {
    if (cell >= 1) {
      if (cells[cell].alive === cells[cell - 1].alive) {
        length++;
      } else {
        aliveCells[5].push(length);
        length = 1;
      }
    }
  }
  // saves the save as a JSON to your PC
  // save(aliveCells, `I:/Google Drive/Coding/JS/game_of_life/test.json`, true);
  console.log(input_save.value() + `:`, JSON.stringify(aliveCells));
  saves[input_save.value()] = aliveCells;
  localStorage.setItem(`GOL_saves`, JSON.stringify(saves));
  // console.log(`Copy the above array, and paste it in the empty space in the pre-made `example` save (line 23). Then type `example` into the box left of the `Load game` button and click the `Load game` button to load your save!`);
  input_save.value(``);
}

function create_inputs() {
  // create the input field for the `Load game` button
  input_load = createInput();
  input_load.elt.placeholder = `Save name`
  input_load.position(game_width / 2 - input_load.width / 2 - 83 / 2, canvas_height + 15);

  // create the input field for the `Save game` button
  input_save = createInput();
  input_save.elt.placeholder = `Save name`
  input_save.position(game_width / 2 - input_load.width / 2 - 83 / 2, canvas_height + 15 + 25);
}

function create_buttons() {
  // create the `Load game` button
  button_load = createButton(`Load game`);
  button_load.position(input_load.x + input_load.width + 5, input_load.y);
  button_load.mousePressed(load_game);

  // create the `Save game` button
  button_save = createButton(`Save game`);
  button_save.position(input_save.x + input_save.width + 5, input_save.y);
  button_save.mousePressed(save_game);
}

class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  draw() {
    push();
    noFill();
    stroke(cursor_color);
    strokeWeight(2);
    rect(this.x, this.y, cell_width_height, cell_width_height);
    pop();
  }
}

class Cell {
  constructor(x, y, number) {
    this.x = x;
    this.y = y;
    this.number = number;
    this.alive = 0;
    this.total = 0;
  }

  draw() {
    push();
    stroke(stroke_color);
    if (stroke_color[stroke_color.length - 1] === 0 && stroke_color.length % 2 == 0) {
      noStroke();
    }
    if (this.alive) {
      fill(0);
    } else {
      noFill();
    }
    rect(this.x, this.y, cell_width_height, cell_width_height);
    pop();
  }

  neighbours() {
    if (playing) {
      this.total = 0;
      // top-left
      let offset = 0;
      if (this.number < cell_width_count) {
        offset += cell_width_count * cell_height_count; // top
      }
      if (this.number % cell_width_count === 0) {
        offset += cell_width_count; // left
      }
      this.total += cells[this.number - cell_width_count - 1 + offset].alive;

      // top
      offset = 0;
      if (this.number < cell_width_count) {
        offset += cell_width_count * cell_height_count;
      }
      this.total += cells[this.number - cell_width_count + offset].alive;

      // top-right
      offset = 0;
      if (this.number < cell_width_count) {
        offset += cell_width_count * cell_height_count;
      }
      if (this.number % cell_width_count === cell_width_count - 1) {
        offset -= cell_width_count;
      }
      this.total += cells[this.number - cell_width_count + 1 + offset].alive;

      // left
      offset = 0;
      if (this.number % cell_width_count === 0) {
        offset += cell_width_count;
      }
      this.total += cells[this.number - 1 + offset].alive;

      // right
      offset = 0;
      if ( /*this.number >= cell_width_count * cell_height_count - 1 && */ this.number % cell_width_count === cell_width_count - 1) {
        offset -= cell_width_count;
      }
      this.total += cells[this.number + 1 + offset].alive;

      // bottom-left
      offset = 0;
      if (this.number > cell_width_count * cell_height_count - cell_width_count - 1) {
        offset -= cell_width_count * cell_height_count;
      }
      if (this.number % cell_width_count === 0) {
        offset += cell_width_count;
      }
      this.total += cells[this.number + cell_width_count - 1 + offset].alive;

      // bottom
      offset = 0;
      if (this.number > cell_width_count * cell_height_count - cell_width_count - 1) {
        offset -= cell_width_count * cell_height_count;
      }
      this.total += cells[this.number + cell_width_count + offset].alive;

      // bottom-right
      offset = 0;
      if (this.number > cell_width_count * cell_height_count - cell_width_count - 1) {
        offset -= cell_width_count * cell_height_count;
      }
      if (this.number % cell_width_count === cell_width_count - 1) {
        offset -= cell_width_count;
      }
      this.total += cells[this.number + cell_width_count + 1 + offset].alive;
    }
  }

  calculate() {
    if (playing) {
      switch (this.total) {
        case 2:
          break;
        case 3:
          if (!this.alive) {
            this.alive = 1;
          }
          break;
        case 6:
          if (mode === `high_life`) {
            if (!this.alive) {
              this.alive = 1;
            }
          }
          break;
        default:
          this.alive = 0;
          break;
      }
    }
  }

  clicked() {}
}

function up() {
  if (cursor.y > 0) {
    cursor.y -= cell_width_height;
  }
}

function down() {
  if (cursor.y < game_height - cell_width_height) {
    cursor.y += cell_width_height;
  }
}

function left() {
  if (cursor.x > 0) {
    cursor.x -= cell_width_height;
  }
}

function right() {
  if (cursor.x < game_width - cell_width_height) {
    cursor.x += cell_width_height;
  }
}

function keyPressed() {
  switch (keyCode) {
    // case 87: // w
    //   up()
    //   break;
    // case 83: // s
    //   down()
    //   break;
    // case 65: // a
    //   left()
    //   break;
    // case 68: // d
    //   right()
    //   break;

    case UP_ARROW: // up
      up()
      break;
    case DOWN_ARROW: // down
      down()
      break;
    case LEFT_ARROW: // left
      left()
      break;
    case RIGHT_ARROW: // right
      right()
      break;

    case 89: //y, place
      let cell = cells[cursor.x / cell_width_height + cursor.y / cell_width_height * cell_width_count];
      if (!cell.alive) {
        cell.alive = 1;
      } else {
        cell.alive = 0;
      }
      break;

    case 87: // w, 
      if (playing) {
        playing = false;
      } else {
        playing = true;
      }
      break;
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < game_width && mouseY > 0 && mouseY < game_height) {
    first_cell_alive = cells[floor(mouseX / cell_width_height) + floor(mouseY / cell_width_height) * cell_width_count].alive;
  }
}

window.addEventListener(`contextmenu`, (e) => {
  e.preventDefault();
});