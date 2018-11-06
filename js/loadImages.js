function loadImages() {
  for (let i in buildings) {
    images.push(loadImage(`images/${i}.png`));
  }
}