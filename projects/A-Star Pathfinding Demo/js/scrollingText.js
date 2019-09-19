class ScrollingText {
  constructor() {
    this.updates = 0;
    this.txt = 'WAVE ';
  }

  draw() {
    textSize(50);
    const x = width / 2 - (textWidth(this.txt + wave) / 2);

    const val = pow(this.updates - 46, 3) * 0.00002 + 2;
    const y = map(val, 0, 4, 0, height);

    let alpha;
    // 2 is when the text is in the middle of the screen, but I probably shouldn't hardcode this.
    if (val < 2) {
      alpha = map(val, 0, 2, 0, 255);
    } else {
      alpha = map(val, 2, 4.5, 255, 0);
    }

    push();
    stroke(0, alpha);
    fill(255, 0, 0, alpha);
    text(this.txt + wave, x, y);
    pop();
  }
  
  scrollText() {
    scrollingTextWave.draw();
    scrollingTextWave.updates++;
    if (scrollingTextWave.updates > 120) {
      waveActive = !waveActive;
      scrollingTextWave.updates = 0;
    }
  }
}