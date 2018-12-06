function loadImages() {
  for (let building in buildings) {
    images.buildings.push(loadImage(`images/buildings/${building}.png`));
  }

  images.sound.push(loadImage(`images/sound/sound_on.png`));
  images.sound.push(loadImage(`images/sound/sound_off.png`));
}