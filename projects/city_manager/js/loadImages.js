let sprites = {
  'empty': undefined,
  'farm': undefined,
  'house': undefined,
  'laboratory': undefined,
  'office': undefined,
  'reactor': undefined,
  'uranium_mine': undefined,
  'windmill': undefined
};

function loadImages() {
  for (const name in sprites) {
    if (sprites.hasOwnProperty(name)) {
      sprites[name] = loadImage(`sprites/${name}.png`);
    }
  }

  // sprites.forEach(function (element) {
  //   sprites.push(loadImage(`sprites/${element}.png`));
  // });

  // for (let building in buildings) {
  //   images.buildings.push(loadImage(`images/buildings/${building}.png`));
  // }

  // images.sound.push(loadImage(`images/sound/sound_on.png`));
  // images.sound.push(loadImage(`images/sound/sound_off.png`));
}