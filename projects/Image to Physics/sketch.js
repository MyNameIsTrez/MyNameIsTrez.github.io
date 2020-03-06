function preload() {
  img = loadImage('flower.jpg');
}

function setup() {
  createCanvas(img.width + img_x_offset * 2, img.height + img_y_offset * 2);
  pixelDensity(1);
  image(img, img_x_offset, img_y_offset);
  loadPixels();
  // console.log(img.width * img.height);
  // console.log(pixels.length / 4);

  for (let y = img_y_offset; y < img.height + img_y_offset; y++) {
    for (let x = img_x_offset; x < img.width + img_x_offset; x++) {
      let index = (x + y * width) * 4;
      let clr = [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
      let pxl = new Pxl(x, y, clr, index);
      pxls.push(pxl);
    }
  }
}

function draw() {
  mouse_velocity();

  background(bg_clr);
  for (let pxl in pxls) {
    pxls[pxl].draw();
  }
  loadPixels();
  for (let pxl in pxls) {
    pxls[pxl].wind();
    pxls[pxl].move();
  }
}

let img;
let img_x_offset = 0; // fix this
let img_y_offset = 50;
let pxls = [];
let bg_clr = [255, 255, 255, 255]; // white
let mouseX_diff
let mouseY_diff
let last_mouseX;
let last_mouseY;

function mouse_velocity() {
  mouseX_diff = mouseX - last_mouseX;
  mouseY_diff = mouseY - last_mouseY;
  last_mouseX = mouseX;
  last_mouseY = mouseY;
  // console.log(mouseX_diff, mouseY_diff);
}

class Pxl {
  constructor(x, y, clr, index) {
    this.x = x;
    this.y = y;
    this.clr = clr;
    this.index = index;
    this.x_speed = Math.round(Math.random()) * 2 - 1;
    this.y_speed = Math.round(Math.random()) * 2 - 1;
    // this.y_speed = 1;
  }

  move() {
    switch (this.y_speed) {
      case -1:
        let indexUp = this.index - width * 4;
        if (pixels[indexUp] === bg_clr[0] && pixels[indexUp + 1] === bg_clr[1] && pixels[indexUp + 2] === bg_clr[2] && pixels[indexUp + 3] === bg_clr[3]) {
          this.index = indexUp;
          this.y--;
        }
        break;
      case 1:
        let indexDown = this.index + width * 4;
        if (pixels[indexDown] === bg_clr[0] && pixels[indexDown + 1] === bg_clr[1] && pixels[indexDown + 2] === bg_clr[2] && pixels[indexDown + 3] === bg_clr[3]) {
          this.index = indexDown;
          this.y++;
        }
        break;
    }

    switch (this.x_speed) {
      case -1:
        let indexLeft = this.index - 4;
        // console.log(pxls.length, this.index / 4);
        // console.log(this.y, pxls[this.index / 4].y);
        // if (this.y === pxls[indexLeft / 4].y) {
        if (pixels[indexLeft] === bg_clr[0] && pixels[indexLeft + 1] === bg_clr[1] && pixels[indexLeft + 2] === bg_clr[2] && pixels[indexLeft + 3] === bg_clr[3]) {
          this.index = indexLeft;
          this.x--;
        }
        // }
        break;
      case 1:
        let indexRight = this.index + 4;
        // if (this.y === pxls[indexRight / 4].y) {
        if (pixels[indexRight] === bg_clr[0] && pixels[indexRight + 1] === bg_clr[1] && pixels[indexRight + 2] === bg_clr[2] && pixels[indexRight + 3] === bg_clr[3]) {
          this.index = indexRight;
          this.x++;
        }
        // }
        break;
    }
  }

  draw() {
    stroke(this.clr);
    point(this.x, this.y);
  }

  wind() {
    // if (last_mouseX !== 0 && last_mouseY !== 0) {
    // if (mouseX > 0 && mouseY > 0) {
    //   this.x += mouseX_diff / dist(this.x, mouseX);
    //   this.y += mouseY_diff / dist(this.y, mouseY);
    // }
    // }
  }
}

function mousePressed() {
  pxls = [];
  setup();
}