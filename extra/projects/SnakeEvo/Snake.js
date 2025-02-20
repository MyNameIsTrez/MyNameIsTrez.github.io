class Snake {
  constructor(index, brain) {
    this.index = index;

    this.agentX = index % agentsHor;
    this.agentY = floor(index / agentsHor);

    this.body = [];
    this.body[0] = this.newGenPos();
    this.xDir = 0;
    this.yDir = 0;
    this.alive = true;
    this.pxls = [];
    this.ticksWithoutFood = 0;

    // Neuroevolution.
    this.score = 0; // Maybe this should be 1?
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      // The pxls around the head of the snake.
      const inputs = 4;
      // North, east, south, west.
      const outputs = 4;
      // ceil((#inputs + #outputs) / 2).
      const hiddenLayers = ceil((inputs + outputs) / 2);

      this.brain = new NeuralNetwork(inputs, hiddenLayers, outputs);
    }
  }

  update() {
    const head = this.body[this.body.length - 1].copy();
    this.body.shift();
    this.body.push(head);
    this.think();
    head.x += this.xDir;
    head.y += this.yDir;
  }

  draw() {
    push();
    noStroke();
    for (let i = 0; i < this.body.length; i++) {
      if (debugColors) {
        if (i === 0) {
          fill(255, 200, 0, 150);
        } else if (i === this.body.length - 1) {
          fill(0, 0, 255, 150);
        } else {
          fill(255, 150);
        }
      } else {
        fill(255);
      }
      const x = this.body[i].x * scl + this.agentX * agentWidth;
      const y = this.body[i].y * scl + this.agentY * agentHeight;
      square(x, y, scl);
    }
    pop();
  }

  die() {
    // savedSnakes.push(this); // Shouldn't this be where this line goes, instead of below?
    this.alive = false;
    savedSnakes.push(this);
  }

  think() {
    let inputs = this.simpleInputs();
    let output = this.brain.predict(inputs);

    // Is this the best way to do this?
    let i = output.indexOf(max(output));
    switch (i) {
      case 0:
        // Go north.
        this.setDir(0, -1);
        break;
      case 1:
        // Go east.
        this.setDir(1, 0);
        break;
      case 2:
        // Go south.
        this.setDir(0, 1);
        break;
      case 3:
        // Go west.
        this.setDir(-1, 0);
        break;
    }
  }

  simpleInputs() {
    const inputs = [];
    const head = this.body[this.body.length - 1];
    let north = 3, east = 3, south = 3, west = 3;
    if (head.y > 0) {
      north = this.pxls[head.x][head.y - 1];
    }
    if (head.x < w - 1) {
      east = this.pxls[head.x + 1][head.y];
    }
    if (head.y < h - 1) {
      south = this.pxls[head.x][head.y + 1];
    }
    if (head.x > 0) {
      west = this.pxls[head.x - 1][head.y];
    }
    inputs.push(north, east, south, west);
    // console.log(inputs);
    // Should I map the inputs to be between 0 and 1?
    return inputs;
  }

  // complexInputs() {
  //   const inputs = [];
  //   for (let x = 0; x < w; x++) {
  //     for (let y = 0; y < h; y++) {
  //       // Should I map the inputs to be between 0 and 1?
  //       // Should I have the head be a different input number than the body?
  //       inputs.push(this.pxls[x][y]);
  //     }
  //   }
  //   return inputs;
  // }

  mutate() {
    this.brain.mutate(mutationRate);
  }

  emptyPxls() {
    this.pxls = [];
    for (let x = 0; x < w; x++) {
      this.pxls.push([]);
      for (let y = 0; y < h; y++) {
        this.pxls[x][y] = 0;
      }
    }
  }

  addSnakePxls() {
    for (let j = 0; j < this.body.length; j++) {
      const x = this.body[j].x;
      const y = this.body[j].y;
      this.pxls[x][y] = 1;
    }
  }

  addFoodPxls() {
    const x = this.food.pos.x;
    const y = this.food.pos.y;
    this.pxls[x][y] = 2;
  }

  drawBorder() {
    const agentX = this.index % agentsHor;
    const agentY = floor(this.index / agentsHor);

    push();
    noFill();
    strokeWeight(3);
    stroke(180);
    rect(agentX * agentWidth, agentY * agentHeight, agentWidth, agentHeight);
    pop();
  }

  setDir(x, y) {
    this.xDir = x;
    this.yDir = y;
  }

  eat(pos) {
    const x = this.body[this.body.length - 1].x;
    const y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      return true;
    } else {
      return false;
    }
  }

  newGenPos() {
    const x = floor(w / 2);
    const y = floor(h / 2);
    const pos = createVector(x, y);
    return pos;
  }

  grow() {
    const head = this.body[this.body.length - 1].copy();
    this.body.push(head);
  }

  checkDeath() {
    // If the snake dies of starvation.
    if (this.ticksWithoutFood > maxTicksWithoutFood) {
      return true;
    }

    const x = this.body[this.body.length - 1].x;
    const y = this.body[this.body.length - 1].y;
    // If the snake is offscreen.
    if (x < 0 || x >= w || y < 0 || y >= h) {
      return true;
    }

    // If the snake is eating itself.
    for (let i = 0; i < this.body.length - 1; i++) {
      const part = this.body[i];
      if (part.x === x && part.y === y) {
        return true;
      }
    }
    return false;
  }
}