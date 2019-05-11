let state = 'editor';

let corners = racetracks.test1;
for (const i in corners) {
  const c = corners[i];
  const corner = new Corner(c.x, c.y, c.placed, c.checkpoint);
  corners[i] = corner;
}
console.log(corners);

function setup() {
  // Navigation
  createButton('race').mousePressed(function () {
    state = 'race';
  });
  createButton('editor').mousePressed(function () {
    state = 'editor';
  });

  createCanvas(innerWidth - 21, innerHeight - 69);
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