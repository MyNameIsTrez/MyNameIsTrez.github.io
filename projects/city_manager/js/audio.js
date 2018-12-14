// https://www.zapsplat.com/music/person-placing-arm-on-leather-sofa-arm-rest-1/
let gridSound = new Audio('audio/grid/grid.mp3');
// https://www.zapsplat.com/music/user-interface-tone-select-digital-button/
let GUISound = new Audio('audio/gui/gui.mp3');
// https://freesound.org/people/Benboncan/audio/91924/
let purchaseSound = new Audio('audio/purchase/purchase.mp3');
// https://www.freesoundeffects.com/free-track/explosion-1-466446/
let removeBuildingsSound = new Audio('audio/remove_buildings/remove_buildings.mp3');

let themes = [
  // https://www.youtube.com/watch?v=yolbGaJD4AY&t=0s&list=PLv64WAmy5KDnB7mQmN_zDIU9NlpKSUHAQ&index=24
  theme1 = new Audio('audio/themes/glorious_morning_2.mp3'),
  // https://www.youtube.com/watch?v=frI8H3gOdd8&t=0s&index=12&list=PLv64WAmy5KDnB7mQmN_zDIU9NlpKSUHAQ
  theme2 = new Audio('audio/themes/rct2_main_theme_edm.mp3'),
  // https://www.youtube.com/watch?v=tvD2cXa4KJM&t=0s&index=13&list=PLv64WAmy5KDnB7mQmN_zDIU9NlpKSUHAQ
  theme3 = new Audio('audio/themes/rct2_main_theme_orchestral.mp3')
]

let theme;
let lastTheme;

function playSoundGrid() {
  gridSound.currentTime = 0;
  gridSound.play();
}

function playSoundGUI() {
  GUISound.currentTime = 0;
  GUISound.play();
}

function playSoundPurchase() {
  purchaseSound.currentTime = 0;
  purchaseSound.play();
}

function playSoundRemoveBuildings() {
  removeBuildingsSound.currentTime = 0;
  removeBuildingsSound.play();
}

function pickTheme() {
  // choose a different random song
  while (theme === lastTheme) {
    theme = random(themes);
  }
  lastTheme = theme;

  theme.volume = 0.1; // 0 to 1, 0.05 to 1 can be heard
  theme.defaultPlaybackRate = 1; // 0.1 to 16

  theme.load();
  theme.play();
}

function playTheme() {
  // the theme can't be played if the user hasn't pressed anything yet
  if (interactedWithPage) {
    // if this is the first time, load and play a song
    if (!theme) {
      pickTheme();
    }

    // if the theme has ended
    theme.onended = function () {
      pickTheme();
    }
  }
}