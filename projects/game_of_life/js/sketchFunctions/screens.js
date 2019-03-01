function loadScreen() {
  if (screen !== 'tutorial') {
    if (screen === `load`) {
      for (let y in cells) { // resets all the cells their ticksDead counter
        for (let x in cells[y]) {
          cells[y][x].ticksDead = maxTicksColored + 1;
        }
      }

      screen = `game`;
    } else {
      screen = `load`;
    }
  }
}

function settingsScreen() {
  if (screen !== 'tutorial') {
    if (screen === `settings`) {
      for (let y in cells) { // resets all the cells their ticksDead counter
        for (let x in cells[y]) {
          cells[y][x].ticksDead = maxTicksColored + 1;
        }
      }

      screen = `game`;
    } else {
      screen = `settings`;
    }
  }
}

function tutorialScreen() {
  if (screen === 'tutorial') {
    for (let y in cells) { // resets all the cells their ticksDead counter
      for (let x in cells[y]) {
        cells[y][x].ticksDead = maxTicksColored + 1;
      }
    }

    screen = `game`;
  } else {
    screen = 'tutorial';
  }
}

// function saveScreen() {
//   if (screen === `save`) {
//     screen = `game`;
//   } else {
//     screen = `save`;
//   }
// }