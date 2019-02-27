function pausePlay() {
  if (screen === `game`) {
    if (playing) {
      playing = false;
    } else {
      playing = true;
    }
  }
}