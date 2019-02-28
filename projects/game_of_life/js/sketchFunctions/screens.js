function loadGameScreen() {
  if (screen === `loadGame`) {
    screen = `game`;
  } else {
    screen = `loadGame`;
  }
}

function settingsScreen() {
  if (screen === `settings`) {
    screen = `game`;
  } else {
    screen = `settings`;
  }
}

function saveGameScreen() {
  if (screen === `saveGame`) {
    screen = `game`;
  } else {
    screen = `saveGame`;
  }
}