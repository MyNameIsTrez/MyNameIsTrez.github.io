const cornerRadius = 25;
let wallType = 'isometric walls';

function editorUpdate() {
  background(sliderBackgroundColor.color().levels);
  updateIsometricWallsMinimal();

  if (mouseIsPressed && wallType === 'isometric walls' && state === 'editor') {
    const mouseInCanvas = mouseX > isometricWallSize && mouseX < width - 2 * isometricWallSize &&
      mouseY > isometricWallSize && mouseY < height - 3 * isometricWallSize;

    if (mouseInCanvas) {
      mouseAction();
    }
  }

  drawLines();
  if (wallType === 'lines & corners') {
    drawCornerRadii();
  }

  push();
  fill(255);
  textSize(30);
  text("Placing: " + wallType, 20, 50);
  pop();
}