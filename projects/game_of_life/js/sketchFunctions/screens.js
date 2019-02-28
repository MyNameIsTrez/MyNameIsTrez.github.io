function loadGameScreen() {
  if (screen !== 'tutorial') {
    if (screen === `loadGame`) {
      screen = `game`;
    } else {
      screen = `loadGame`;
    }
  }
}

function settingsScreen() {
  if (screen !== 'tutorial') {
    if (screen === `settings`) {
      screen = `game`;
    } else {
      screen = `settings`;
    }
  }
}

function tutorialScreen() {
  if (screen !== 'tutorial') {
    screen = 'tutorial';
  } else {
    screen = `game`;
  }
}

// function saveGameScreen() {
//   if (screen === `saveGame`) {
//     screen = `game`;
//   } else {
//     screen = `saveGame`;
//   }
// }