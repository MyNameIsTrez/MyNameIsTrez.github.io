function showDebug() {
  // If a second went by since the last millisecond reading, save the time.
  const updateDebug = frameCount % (debugUpdateInterval * 60) === 0;
  if (updateDebug || !msAverage) {
    const endTime = performance.now();
    const timeDiff = endTime - startTime;
    msAverage = timeDiff / 60;
    startTime = performance.now();
  }

  const displayedInfo = [
    `${round(1000 / msAverage)} fps`
  ]

  // Show the debugging info.
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