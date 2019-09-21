function showDebug(tStart) {
  // Calculate the time draw() took to be processed.
  const tEnd = performance.now();
  const diff = tEnd - tStart;

  const displayedInfo = [
    `${round(frameCount / 60)}s survived`,
    `${round(1000 / diff)} fps`,
    `${round(diff)} ms/frame`
  ]

  // Draw the debugging info.
  push();
  textSize(20);
  textAlign(RIGHT);
  stroke(0);
  strokeWeight(2);
  fill(255, 255, 255)
  const debugScreenRightOffset = width - 15
  const debugScreenUpOffset = 30

  for (i = 0; i < displayedInfo.length; i++) {
    text(displayedInfo[i], debugScreenRightOffset, i * 30 + debugScreenUpOffset);
  }

  pop();
}