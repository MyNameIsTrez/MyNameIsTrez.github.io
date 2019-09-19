function debug(tStart) {
  // Calculate the time draw() took to be processed.
  const tEnd = performance.now();
  const diff = tEnd - tStart;
  
  const displayedInfo = [
    `${round(diff)} ms/frame`,
    player.x
  ]
  
  // Draw the debugging info.
  push();
  textSize(20);
  textAlign(RIGHT);
  const debugScreenRightOffset = width - 15
  const debugScreenUpOffset = 30
  
  for (i = 0; i < displayedInfo.length; i++) {
    text(displayedInfo[i], debugScreenRightOffset, i*30 + debugScreenUpOffset);
  }
  
  pop();
}