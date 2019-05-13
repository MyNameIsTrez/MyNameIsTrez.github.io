const cornerRadius = 50;

function editorUpdate() {
  background(0);
  drawLines();
  drawCornerRadii();

  push();
  fill(255);
  textSize(30);
  text("Left-click to add a wall, right-click to add a checkpoint, ctrl+z to undo.", 20, 50);
  pop();
}