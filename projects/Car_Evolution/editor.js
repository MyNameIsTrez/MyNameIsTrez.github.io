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

  drawWalls();
  drawCheckpoints();
  if (wallType === 'lines & corners') {
    drawCornerRadii();
  }

  push();
  fill(255);
  textSize(30);
  text("Placing: " + wallType, 50, 50);
  text("'w': change what you're placing, left-click/right-click: place walls/checkpoints, 's': to save the track", width - 2019, 50);
  pop();
}