// Game of Life implementation inspiration from:
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life



// editable
let _frameRate = 60; // the framerate of the game
let cellTickRate = 6; // the rate at which cells are ticked
let cell_width_height = 25; // the width and height of each cell in pixels
let cell_width_count = 20; // the amount of cells in the width
let cell_height_count = 20; // the amount of cells in the height
let game_mode = `game_of_life`; // the game mode, game modes: game_of_life, high_life
let loop_mode = true; // whether the cells can loop around the screen at the edges
let draw_grid = false; // whether the grid around the cells is drawn, setting this to false drastically improves performance
let screen = `game`; // the starting screen, default: game

let background_color = [247]; // the background color
let stroke_color = [193]; // the stroke color
let cursor_color = [0, 127, 0]; // the cursor color

const saves = {
  // name: [cellTickRate, cell_width_height, cell_width_count, cell_height_count, first cell-alive state, [length of cells with the same cell-alive states]]
  blinker: [3, 150, 5, 5, 0, [11, 3]],
  toad: [3, 125, 6, 6, 0, [14, 3, 2, 3]],
  beacon: [3, 125, 6, 6, 0, [7, 2, 4, 2, 6, 2, 4, 2]],
  pulsar: [3, 45, 17, 17, 0, [38, 3, 3, 3, 23, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 6, 3, 3, 3, 25, 3, 3, 3, 6, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 23, 3, 3, 3]],
  r_pentomino: [60, 8, 100, 100, 0, [4952, 2, 97, 2, 99, 1]],
  glider: [6, 80, 10, 10, 0, [13, 1, 7, 1, 1, 1, 8, 2]],
  gosper_glider_gun: [30, 16, 38, 49, 0, [63, 1, 35, 1, 1, 1, 25, 2, 6, 2, 12, 2, 13, 1, 3, 1, 4, 2, 12, 2, 2, 2, 8, 1, 5, 1, 3, 2, 16, 2, 8, 1, 3, 1, 1, 2, 4, 1, 1, 1, 23, 1, 5, 1, 7, 1, 24, 1, 3, 1, 34, 2, 117, 2, 36, 2, 376, 2, 3, 2, 70, 1, 3, 1, 34, 3, 35, 3, 114, 1, 36, 3, 34, 1, 3, 1, 35, 1, 34, 1, 5, 1, 31, 1, 5, 1, 32, 1, 3, 1, 34, 3, 339, 2, 36, 2]],
  acorn: [60, 5, 150, 150, 0, [11196, 1, 151, 1, 146, 2, 2, 3]],
  stick: [60, 5, 150, 150, 0, [11305, 8, 1, 5, 3, 3, 6, 7, 1, 5]]
}

// adds the user-made saves from the localStorage to the `saves` object
const storageSaves = JSON.parse(localStorage.getItem(`GOL_saves`));
for (const save in storageSaves) {
  saves[save] = storageSaves[save];
}
let save_number = 0; // the default save that's shown in the loading screen

let game_width = cell_width_height * cell_width_count;
let game_height = cell_width_height * cell_height_count;
let gui_height = 100;
let canvas_height = game_height + gui_height;

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
  switch (screen) {
    case `game`:
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

      // create the boundary box for the grid and the `Playing: true` text
      push();
      noFill();
      stroke(stroke_color);
      rect(0, 0, game_width, game_height);
      rect(0, game_height, game_width, canvas_height - game_height);
      pop();

      // create the `Playing: true` text
      push();
      textSize(36);
      if (playing) {
        fill(0, 191, 0);
      } else {
        fill(255, 0, 0);
      }

      text(`Playing: ` + playing, width / 2 - textWidth(`Playing: ` + playing) / 2, game_height + gui_height / 2 + textSize() / 2);
      pop();
      break;
    case `load_game`:
      let save = Object.keys(saves)[save_number];
      let rect_text_space = 10;
      push();
      textSize(48);
      let x = game_width / 2 - (textWidth(save_number + save) + 4 * rect_text_space) / 2;
      let y = canvas_height / 2 - textSize();

      // creates a box and draws the number of the save name on top of it
      rect(x, y, textWidth(save_number + 1) + 2 * rect_text_space, textSize() + 2 * rect_text_space);
      text(save_number + 1, x + rect_text_space, y + textSize());

      // moves the x to the right of the number box
      x = x + textWidth(save_number + 1) + 2 * rect_text_space;

      // creates a box and draws the save name on top of it
      rect(x, y, textWidth(save) + 2 * rect_text_space, textSize() + 2 * rect_text_space);
      text(save, x + rect_text_space, y + textSize());
      pop();
      break;
    case `save_game`:
      text(`save_game`, 200, 100);
      break;
  }
}

function load_game(save_number) {
  let save_name = Object.keys(saves)[save_number];

  cellTickRate = saves[save_name][0];
  cell_width_height = saves[save_name][1];
  cell_width_count = saves[save_name][2];
  cell_height_count = saves[save_name][3];

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

  let alive = saves[save_name][4]; // the starting cell`s alive state
  let cell = 0;
  for (const size of saves[save_name][5]) {
    for (let i = 0; i < size; i++) {
      cells[cell++].alive = alive ? 1 : 0;
    }
    alive = !alive;
  }

  input_save.position(game_width / 2 - input_save.width / 2 - 83 / 2, canvas_height + 15 + 25);

  button_save.position(input_save.x + input_save.width + 5, input_save.y);

  cursor.x = 0;
  cursor.y = 0;

  screen = `game`;
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
  // create the input field for the `Save game` button
  input_save = createInput();
  input_save.elt.placeholder = `Save name`
  input_save.position(game_width / 2 - input_save.width / 2 - 83 / 2, canvas_height + 15 + 25);
}

function create_buttons() {
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
    if (draw_grid) {
      stroke(stroke_color);
    } else {
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
      if (loop_mode) {
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


      } else {


        this.total = 0;
        // top-left
        if (this.number > cell_width_count && this.number % cell_width_count !== 0) {
          this.total += cells[this.number - cell_width_count - 1].alive;
        }
        // top
        if (this.number > cell_width_count - 1) {
          this.total += cells[this.number - cell_width_count].alive;
        }
        // top-right
        if (this.number > cell_width_count - 1 && this.number % cell_width_count !== cell_width_count - 1) {
          this.total += cells[this.number - cell_width_count + 1].alive;
        }

        // left
        if (this.number > 0 && this.number % cell_width_count !== 0) {
          this.total += cells[this.number - 1].alive;
        }
        // right
        if (this.number < cell_width_count * cell_height_count - 1 && this.number % cell_width_count !== cell_width_count - 1) {
          this.total += cells[this.number + 1].alive;
        }

        // bottom-left
        if (this.number < cell_width_count * cell_height_count - cell_width_count && this.number % cell_width_count !== 0) {
          this.total += cells[this.number + cell_width_count - 1].alive;
        }
        // bottom
        if (this.number < cell_width_count * cell_height_count - cell_width_count) {
          this.total += cells[this.number + cell_width_count].alive;
        }
        // bottom-right
        if (this.number < cell_width_count * cell_height_count - cell_width_count - 1 && this.number % cell_width_count !== cell_width_count - 1) {
          this.total += cells[this.number + cell_width_count + 1].alive;
        }
      }
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
          if (game_mode === `high_life`) {
            if (!this.alive) {
              this.alive = 1;
            }
          } else {
            this.alive = 0;
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
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.y > 0) {
          cursor.y -= cell_width_height;
        }
      }
      break;
    case `load_game`:
      if (save_number > 0) {
        save_number--;
      } else {
        save_number = Object.keys(saves).length - 1;
      }
      break;
  }
}

function down() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.y < game_height - cell_width_height) {
          cursor.y += cell_width_height;
        }
      }
      break;
    case `load_game`:
      if (save_number < Object.keys(saves).length - 1) {
        save_number++;
      } else {
        save_number = 0;
      }
      break;
  }
}

function left() {
  if (!playing) {
    if (cursor.x > 0) {
      cursor.x -= cell_width_height;
    }
  }
}

function right() {
  if (!playing) {
    if (cursor.x < game_width - cell_width_height) {
      cursor.x += cell_width_height;
    }
  }
}

function click() {
  switch (screen) {
    case `game`:
      if (!playing) {
        let cell = cells[cursor.x / cell_width_height + cursor.y / cell_width_height * cell_width_count];
        if (!cell.alive) {
          cell.alive = 1;
        } else {
          cell.alive = 0;
        }
      }
      break;
    case `load_game`:
      load_game(save_number);
      break;
  }
}

function pause_play() {
  if (screen === `game`) {
    if (playing) {
      playing = false;
    } else {
      playing = true;
    }
  }
}

function load_game_screen() {
  if (screen === `load_game`) {
    screen = `game`;
  } else {
    screen = `load_game`;
  }
}

function clear_screen() {
  playing = false;
  for (cell in cells) {
    cells[cell].alive = 0; // all cells' alive states are 0
  }
}

function save_game_screen() {
  if (screen === `save_game`) {
    screen = `game`;
  } else {
    screen = `save_game`;
  }
}

function keyPressed() {
  switch (keyCode) {
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

    case 89: //y, click
      click();
      break;

    case 87: // w, pause/play
      pause_play();
      break;

    case 65: // a, open the load screen
      load_game_screen();
      break;

    case 83: // s, clear the screen of cells
      clear_screen();
      break;

    case 68: // d, open the save screen
      save_game_screen();
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