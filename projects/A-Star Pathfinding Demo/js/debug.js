function showDebug(startTime) {
  // Calculate the time draw() took to be processed.
  const endTime = performance.now();

  // If a second went by since the last millisecond reading, save the time.
  const timeElapsed = frameCount % (debugUpdateInterval * 60) === 0;
  if (timeElapsed || !msElapsed) {
    msElapsed = endTime - startTime;
  }

  const displayedInfo = [
    `${round(frameCount / 60)}s survived`,
    `${round(1000 / msElapsed)} fps`,
    `${round(msElapsed)} ms/frame`
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
    if (msElapsed) {
      text(displayedInfo[i], debugScreenRightOffset, i * 30 + debugScreenUpOffset);
    }
  }

  pop();
}