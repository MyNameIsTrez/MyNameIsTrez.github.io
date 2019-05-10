let state = "editor";
let corners = [];

function setup() {  
  // Navigation
  createButton('race').mousePressed(function() {
    state = 'race';
  });
  createButton('editor').mousePressed(function() {
    state = 'editor';
  });
  
  createCanvas(innerWidth - 21, innerHeight - 69);
}

function draw() {
  switch (state) {
    case "race":
      raceUpdate();
      break;
    case "editor":
      editorUpdate();
      break;
  }
}