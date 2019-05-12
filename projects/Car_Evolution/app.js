let state = 'race';

// Race
let car;
let walls = [];
let generation = 0;

// Read racetracks.js and use the corners
let corners = racetracks.test2;
for (const i in corners) {
  const c = corners[i];
  const corner = new Corner(c.x, c.y, c.placed, c.checkpoint);
  corners[i] = corner;
}

function setup() {
  // Navigation
  createButton('race').mousePressed(function() {
    state = 'race';
  });
  createButton('editor').mousePressed(function() {
    state = 'editor';
  });

  // Race  
  // Add 5 randomly placed walls.
  for (const i in corners) {
    if (i % 2 === 1) {
      const lastCorner = corners[i - 1];
      const corner = corners[i];
      const x1 = lastCorner.x;
      const y1 = lastCorner.y;
      const x2 = corner.x;
      const y2 = corner.y;
      const checkpoint = corners[i].checkpoint;
      walls.push(new Boundary(x1, y1, x2, y2, checkpoint));
    }
  }

  car = new Car(230, 500, 10, 20, 0, 180, 45);

  createCanvas(innerWidth - 21, innerHeight - 80);
}

function draw() {
  switch (state) {
    case 'race':
      raceUpdate();
      break;
    case 'editor':
      editorUpdate();
      break;
  }
}