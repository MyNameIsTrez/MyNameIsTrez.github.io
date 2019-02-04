// Game of Life implementation inspiration from:
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life



// editable
let cell_tick_rate = 6; // the rate at which cells are ticked
let cell_width_height = 45; // the width and height of each cell in pixels
let cell_width_count = 16; // the amount of cells in the width
let cell_height_count = 16; // the amount of cells in the height

let game_mode = `game_of_life`; // the game mode, game modes: game_of_life, high_life
let loop_edges = true; // whether the cells can loop around the screen at the edges
let draw_grid = false; // whether the grid around the cells is drawn, setting this to false drastically improves performance
let screen = `game`; // the starting screen, default: game

let background_color = [247]; // the background color
let stroke_color = [193]; // the stroke color
let previous_next_color = 200; // the color of the previous and next item
let cursor_color = [0, 127, 0]; // the cursor color

const saves = {
  // name: [cell_tick_rate, cell_width_height, cell_width_count, cell_height_count, first cell-alive state, [length of cells with the same cell-alive states]]
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

const settings = [`clear cells`, `loop edges: `, `draw grid: `, `game mode: `, `cell tick rate: `, `cell width & height: `, `cell width count: `, `cell height count: `];

// adds the user-made saves from the localStorage to the `saves` object
const storage_saves = JSON.parse(localStorage.getItem(`GOL_saves`));
for (const save in storage_saves) {
  saves[save] = storage_saves[save];
}

// non-editable
let save_number = 0; // the default save that's shown in the loading screen
let setting_number = 0; // the default setting that's shown in the settings screen
let frame_rate = 60; // the framerate of the game, always 60 FPS
let gui_height = 100;

let
  cells = [],
  playing = false,
  first_cell_alive,
  input_load,
  button_load,
  input_save,
  button_save,
  cursor,
  game_width,
  game_height,
  canvas_height,
  previous_save_number,
  next_save_number,
  previous_setting_number,
  next_setting_number,
  text_size,
  rect_text_space;

function createGame() {
  cells = []; // removes all cells, for when you 
  game_width = cell_width_height * cell_width_count;
  game_height = cell_width_height * cell_height_count;
  canvas_height = game_height + gui_height;
  text_size = game_width / 50;
  rect_text_space = text_size / 1.75;

  createCanvas(game_width + 1, canvas_height + 1); // `+ 1` is needed to show the bottom and right strokes

  for (let y = 0; y < cell_height_count; y++) {
    for (let x = 0; x < cell_width_count; x++) {
      cell = new Cell(x * cell_width_height, y * cell_width_height, cells.length);
      cells.push(cell)
    }
  }

  input_save.position(game_width / 2 - input_save.width / 2 - 83 / 2, canvas_height + 15 + 25);
  button_save.position(input_save.x + input_save.width + 5, input_save.y);
}

function setup() {
  frameRate(frame_rate)
  cursor = new Cursor();
  create_input();
  create_button();

  createGame();
}

function draw() {
  background(background_color);
  let x, y;
  switch (screen) {
    case `game`:
      if (frameCount % (frame_rate / cell_tick_rate) === 0) { // limits the cells to the cell_tick_rate
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
      textSize(text_size * 3);
      if (playing) {
        fill(0, 191, 0);
      } else {
        fill(255, 0, 0);
      }

      text(`Playing: ` + playing, width / 2 - textWidth(`Playing: ` + playing) / 2, game_height + gui_height / 2 + textSize() / 2);
      pop();
      break;
    case `load_game`:
      if (save_number > 0) { // shows the previous save
        previous_save_number = save_number - 1;
      } else {
        previous_save_number = Object.keys(saves).length - 1;
      }
      get_load_game(previous_next_color, text_size * 2, previous_save_number, -5);

      get_load_game(0, text_size * 3, save_number, -1); // shows the currently selected save

      if (save_number < Object.keys(saves).length - 1) { // shows the next save
        next_save_number = save_number + 1;
      } else {
        next_save_number = 0;
      }
      get_load_game(previous_next_color, text_size * 2, next_save_number, 2);
      break;
    case `save_game`:
      let save_game_placeholder_text = `WIP SAVE SCREEN - Use the input field below the game to save your game for now.`;
      push();
      textSize(text_size);
      x = game_width / 2 - (textWidth(save_game_placeholder_text) + 2 * rect_text_space) / 2;
      y = canvas_height / 2 - textSize();
      rect(x, y, textWidth(save_game_placeholder_text) + 2 * rect_text_space, textSize() + 2 * rect_text_space);
      text(save_game_placeholder_text, x + rect_text_space, y + textSize());
      pop();
      break;
    case `settings`:
      if (setting_number > 0) { // shows the previous setting
        previous_setting_number = setting_number - 1;
      } else {
        previous_setting_number = Object.keys(settings).length - 1;
      }
      get_setting(previous_next_color, text_size * 2, previous_setting_number, -5);

      get_setting(0, text_size * 3, setting_number, -1); // shows the currently selected setting

      if (setting_number < Object.keys(settings).length - 1) { // shows the next setting
        next_setting_number = setting_number + 1;
      } else {
        next_setting_number = 0;
      }
      get_setting(previous_next_color, text_size * 2, next_setting_number, 2);
      break;
  }
}

function get_load_game(load_game_stroke, load_game_textSize, load_game_save_number, height_modifier) {
  save = Object.keys(saves)[load_game_save_number];

  push();
  stroke(load_game_stroke);
  textSize(load_game_textSize);

  x = game_width / 2 - (textWidth(load_game_save_number + save) + 4 * rect_text_space) / 2;
  y = canvas_height / 2 + height_modifier * textSize();

  draw_load_game(x, y, load_game_save_number, save);
  pop();
}

function draw_load_game(x, y, save_number, save) {
  // creates a box and draws the number of the save name on top of it
  rect(x, y, textWidth(save_number + 1) + 2 * rect_text_space, textSize() + 2 * rect_text_space);
  text(save_number + 1, x + rect_text_space, y + textSize());

  // moves the x to the right of the number box
  x += textWidth(save_number + 1) + 2 * rect_text_space;

  // creates a box and draws the save name on top of it
  rect(x, y, textWidth(save) + 2 * rect_text_space, textSize() + 2 * rect_text_space);
  text(save, x + rect_text_space, y + textSize());
}

function get_setting(setting_stroke, setting_textSize, setting_number, height_modifier) {
  let setting = settings[setting_number];
  info = getSetting(setting);

  push();
  stroke(setting_stroke);
  textSize(setting_textSize);

  x = game_width / 2 - (textWidth(setting + info) + 4 * rect_text_space) / 2;
  y = canvas_height / 2 + height_modifier * textSize();

  draw_setting(x, y, setting, setting_number, info);
  pop();
}

function draw_setting(x, y, setting, setting_number, info) {
  // creates a box and draws the number of the setting name on top of it
  rect(x, y, textWidth(setting_number + 1) + 2 * rect_text_space, textSize() + 2 * rect_text_space);
  text(setting_number + 1, x + rect_text_space, y + textSize());

  x += textWidth(setting_number + 1) + 2 * rect_text_space;

  // creates a box and draws the setting name and state on top of it
  rect(x, y, textWidth(setting + info) + 2 * rect_text_space, textSize() + 2 * rect_text_space);
  text(setting + info, x + rect_text_space, y + textSize());
}

function getSetting(setting) {
  switch (setting) {
    case `loop edges: `:
      info = loop_edges;
      break;
    case `draw grid: `:
      info = draw_grid;
      break;
    case `game mode: `:
      info = game_mode;
      break;
    case `cell tick rate: `:
      info = cell_tick_rate;
      break;
    case `cell width & height: `:
      info = cell_width_height;
      break;
    case `cell width count: `:
      info = cell_width_count;
      break;
    case `cell height count: `:
      info = cell_height_count;
      break;
    default:
      info = ``;
      break;
  }
  return info;
}

function load_game(save_number) {
  let save_name = Object.keys(saves)[save_number];

  cell_tick_rate = saves[save_name][0];
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
  aliveCells.push(cell_tick_rate, cell_width_height, cell_width_count, cell_height_count, cells[0].alive, []);
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
  console.log(input_save.value() + `:`, JSON.stringify(aliveCells));
  saves[input_save.value()] = aliveCells;
  localStorage.setItem(`GOL_saves`, JSON.stringify(saves));
  input_save.value(``);
}

function create_input() {
  // create the input field for the `Save game` button
  input_save = createInput();
  input_save.elt.placeholder = `Save name`
  input_save.position(game_width / 2 - input_save.width / 2 - 83 / 2, canvas_height + 15 + 25);
}

function create_button() {
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
      if (loop_edges) {
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
        if (this.number % cell_width_count === cell_width_count - 1) {
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
  clicked() { }
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
    case `settings`:
      if (setting_number > 0) {
        setting_number--;
      } else {
        setting_number = settings.length - 1;
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
    case `settings`:
      if (setting_number < settings.length - 1) {
        setting_number++;
      } else {
        setting_number = 0;
      }
      break;
  }
}

function left() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.x > 0) {
          cursor.x -= cell_width_height;
        }
      }
      break;
    case `settings`:
      switch (settings[setting_number]) {
        case `loop edges: `:
          loop_edges = !loop_edges;
          break;
        case `draw grid: `:
          draw_grid = !draw_grid;
          break;
        case `game mode: `:
          switch (game_mode) {
            case `game_of_life`:
              game_mode = `high_life`;
              break;
            case `high_life`:
              game_mode = `game_of_life`;
              break;
          }
          break;
        case `cell tick rate: `:
          switch (cell_tick_rate) {
            case 60:
              cell_tick_rate = 30;
              break;
            case 30:
              cell_tick_rate = 15;
              break;
            case 15:
              cell_tick_rate = 6;
              break;
            case 6:
              cell_tick_rate = 3;
              break;
            case 3:
              cell_tick_rate = 1;
              break;
            case 1:
              cell_tick_rate = 60;
              break;
          }
          break;
        case `cell width & height: `:
          switch (cell_width_height) {
            case 150:
              cell_width_height = 125;
              break;
            case 125:
              cell_width_height = 80;
              break;
            case 80:
              cell_width_height = 45;
              break;
            case 45:
              cell_width_height = 16;
              break;
            case 16:
              cell_width_height = 8;
              break;
            case 8:
              cell_width_height = 150;
              break;
          }
          createGame();
          break;
        case `cell width count: `:
          switch (cell_width_count) {
            case 150:
              cell_width_count = 100;
              break;
            case 100:
              cell_width_count = 49;
              break;
            case 49:
              cell_width_count = 38;
              break;
            case 38:
              cell_width_count = 17;
              break;
            case 17:
              cell_width_count = 16;
              break;
            case 16:
              cell_width_count = 10;
              break;
            case 10:
              cell_width_count = 6;
              break;
            case 6:
              cell_width_count = 5;
              break;
            case 5:
              cell_width_count = 150;
              break;
          }
          createGame();
          break;
        case `cell height count: `:
          switch (cell_height_count) {
            case 150:
              cell_height_count = 100;
              break;
            case 100:
              cell_height_count = 49;
              break;
            case 49:
              cell_height_count = 38;
              break;
            case 38:
              cell_height_count = 17;
              break;
            case 17:
              cell_height_count = 16;
              break;
            case 16:
              cell_height_count = 10;
              break;
            case 10:
              cell_height_count = 6;
              break;
            case 6:
              cell_height_count = 5;
              break;
            case 5:
              cell_height_count = 150;
              break;
          }
          createGame();
          break;
      }
      break;
  }
}

function right() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.x < game_width - cell_width_height) {
          cursor.x += cell_width_height;
        }
      }
      break;
    case `settings`:
      switch (settings[setting_number]) {
        case `loop edges: `:
          loop_edges = !loop_edges;
          break;
        case `draw grid: `:
          draw_grid = !draw_grid;
          break;
        case `game mode: `:
          switch (game_mode) {
            case `game_of_life`:
              game_mode = `high_life`;
              break;
            case `high_life`:
              game_mode = `game_of_life`;
              break;
          }
          break;
        case `cell tick rate: `:
          switch (cell_tick_rate) {
            case 1:
              cell_tick_rate = 3;
              break;
            case 3:
              cell_tick_rate = 6;
              break;
            case 6:
              cell_tick_rate = 15;
              break;
            case 15:
              cell_tick_rate = 30;
              break;
            case 30:
              cell_tick_rate = 60;
              break;
            case 60:
              cell_tick_rate = 1;
              break;
          }
          break;
        case `cell width & height: `:
          switch (cell_width_height) {
            case 8:
              cell_width_height = 16;
              break;
            case 16:
              cell_width_height = 45;
              break;
            case 45:
              cell_width_height = 80;
              break;
            case 80:
              cell_width_height = 125;
              break;
            case 125:
              cell_width_height = 150;
              break;
            case 150:
              cell_width_height = 8;
              break;
          }
          createGame();
          break;
        case `cell width count: `:
          switch (cell_width_count) {
            case 5:
              cell_width_count = 6;
              break;
            case 6:
              cell_width_count = 10;
              break;
            case 10:
              cell_width_count = 16;
              break;
            case 16:
              cell_width_count = 17;
              break;
            case 17:
              cell_width_count = 38;
              break;
            case 38:
              cell_width_count = 49;
              break;
            case 49:
              cell_width_count = 100;
              break;
            case 100:
              cell_width_count = 150;
              break;
            case 150:
              cell_width_count = 5;
              break;
          }
          createGame();
          break;
        case `cell height count: `:
          switch (cell_height_count) {
            case 5:
              cell_height_count = 6;
              break;
            case 6:
              cell_height_count = 10;
              break;
            case 10:
              cell_height_count = 16;
              break;
            case 16:
              cell_height_count = 17;
              break;
            case 17:
              cell_height_count = 38;
              break;
            case 38:
              cell_height_count = 49;
              break;
            case 49:
              cell_height_count = 100;
              break;
            case 100:
              cell_height_count = 150;
              break;
            case 150:
              cell_height_count = 5;
              break;
          }
          createGame();
          break;
      }
      break;
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
      screen = `game`;
      break;
    case `settings`:
      switch (settings[setting_number]) {
        case `clear cells`:
          clear_screen();
          break;
      }
      screen = `game`;
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

function settings_screen() {
  if (screen === `settings`) {
    screen = `game`;
  } else {
    screen = `settings`;
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

    case 83: // s, open the settings screen
      settings_screen();
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