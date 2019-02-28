function up() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.y > 0) {
          cursor.y -= cellWidthHeight;
        }
      }
      break;
    case `loadGame`:
      if (saveNumber > 0) {
        saveNumber--;
      } else {
        saveNumber = Object.keys(saves).length - 1;
      }
      break;
    case `settings`:
      if (settingNumber > 0) {
        settingNumber--;
      } else {
        settingNumber = settings.length - 1;
      }
      break;
  }
}

function down() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.y < gameHeight - cellWidthHeight) {
          cursor.y += cellWidthHeight;
        }
      }
      break;
    case `loadGame`:
      if (saveNumber < Object.keys(saves).length - 1) {
        saveNumber++;
      } else {
        saveNumber = 0;
      }
      break;
    case `settings`:
      if (settingNumber < settings.length - 1) {
        settingNumber++;
      } else {
        settingNumber = 0;
      }
      break;
  }
}

function left() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.x > 0) {
          cursor.x -= cellWidthHeight;
        }
      }
      break;
    case `settings`:
      switch (settings[settingNumber]) {
        case `loop edges: `:
          loopEdges = !loopEdges;
          break;
        case `draw grid paused: `:
          drawGridPaused = !drawGridPaused;
          break;
        case `draw grid playing: `:
          drawGridPlaying = !drawGridPlaying;
          break;
        case `game mode: `:
          switch (gameMode) {
            case `game_of_life`:
              gameMode = `high_life`;
              break;
            case `high_life`:
              gameMode = `game_of_life`;
              break;
          }
          break;
        case `cell tick rate: `:
          switch (cellTickRate) {
            case 60:
              cellTickRate = 30;
              break;
            case 30:
              cellTickRate = 15;
              break;
            case 15:
              cellTickRate = 6;
              break;
            case 6:
              cellTickRate = 3;
              break;
            case 3:
              cellTickRate = 1;
              break;
            case 1:
              cellTickRate = 60;
              break;
          }
          break;
        case `cell width count: `:
          switch (cellWidthCount) {
            case 150:
              cellWidthCount = 100;
              break;
            case 100:
              cellWidthCount = 49;
              break;
            case 49:
              cellWidthCount = 38;
              break;
            case 38:
              cellWidthCount = 24;
              break;
            case 24:
              cellWidthCount = 17;
              break;
            case 17:
              cellWidthCount = 16;
              break;
            case 16:
              cellWidthCount = 10;
              break;
            case 10:
              cellWidthCount = 6;
              break;
            case 6:
              cellWidthCount = 5;
              break;
            case 5:
              cellWidthCount = 150;
              break;
          }
          createGame();
          break;
        case `cell height count: `:
          switch (cellHeightCount) {
            case 150:
              cellHeightCount = 100;
              break;
            case 100:
              cellHeightCount = 49;
              break;
            case 49:
              cellHeightCount = 38;
              break;
            case 38:
              cellHeightCount = 17;
              break;
            case 17:
              cellHeightCount = 16;
              break;
            case 16:
              cellHeightCount = 10;
              break;
            case 10:
              cellHeightCount = 6;
              break;
            case 6:
              cellHeightCount = 5;
              break;
            case 5:
              cellHeightCount = 150;
              break;
          }
          createGame();
          break;
        case `max ticks colored: `:
          switch (maxTicksColored) {
            case 256:
              maxTicksColored = 128;
              break;
            case 128:
              maxTicksColored = 64;
              break;
            case 64:
              maxTicksColored = 32;
              break;
            case 32:
              maxTicksColored = 16;
              break;
            case 16:
              maxTicksColored = 8;
              break;
            case 8:
              maxTicksColored = 4;
              break;
            case 4:
              maxTicksColored = 2;
              break;
            case 2:
              maxTicksColored = 1;
              break;
            case 1:
              maxTicksColored = 0;
              break;
            case 0:
              maxTicksColored = 256;
              break;
          }

          for (let y in cells) { // resets all the cells their ticksDead counter
            for (let x in cells[y]) {
              cells[y][x].ticksDead = maxTicksColored + 1;
            }
          }
          break;
      }
  }
}

function right() {
  switch (screen) {
    case `game`:
      if (!playing) {
        if (cursor.x < gameWidth - cellWidthHeight) {
          cursor.x += cellWidthHeight;
        }
      }
      break;
    case `settings`:
      switch (settings[settingNumber]) {
        case `loop edges: `:
          loopEdges = !loopEdges;
          break;
        case `draw grid paused: `:
          drawGridPaused = !drawGridPaused;
          break;
        case `draw grid playing: `:
          drawGridPlaying = !drawGridPlaying;
          break;
        case `game mode: `:
          switch (gameMode) {
            case `game_of_life`:
              gameMode = `high_life`;
              break;
            case `high_life`:
              gameMode = `game_of_life`;
              break;
          }
          break;
        case `cell tick rate: `:
          switch (cellTickRate) {
            case 1:
              cellTickRate = 3;
              break;
            case 3:
              cellTickRate = 6;
              break;
            case 6:
              cellTickRate = 15;
              break;
            case 15:
              cellTickRate = 30;
              break;
            case 30:
              cellTickRate = 60;
              break;
            case 60:
              cellTickRate = 1;
              break;
          }
          break;
        case `cell width count: `:
          switch (cellWidthCount) {
            case 5:
              cellWidthCount = 6;
              break;
            case 6:
              cellWidthCount = 10;
              break;
            case 10:
              cellWidthCount = 16;
              break;
            case 16:
              cellWidthCount = 17;
              break;
            case 17:
              cellWidthCount = 24;
              break;
            case 24:
              cellWidthCount = 38;
              break;
            case 38:
              cellWidthCount = 49;
              break;
            case 49:
              cellWidthCount = 100;
              break;
            case 100:
              cellWidthCount = 150;
              break;
            case 150:
              cellWidthCount = 5;
              break;
          }
          createGame();
          break;
        case `cell height count: `:
          switch (cellHeightCount) {
            case 5:
              cellHeightCount = 6;
              break;
            case 6:
              cellHeightCount = 10;
              break;
            case 10:
              cellHeightCount = 16;
              break;
            case 16:
              cellHeightCount = 17;
              break;
            case 17:
              cellHeightCount = 38;
              break;
            case 38:
              cellHeightCount = 49;
              break;
            case 49:
              cellHeightCount = 100;
              break;
            case 100:
              cellHeightCount = 150;
              break;
            case 150:
              cellHeightCount = 5;
              break;
          }
          createGame();
          break;
        case `max ticks colored: `:
          switch (maxTicksColored) {
            case 0:
              maxTicksColored = 1;
              break;
            case 1:
              maxTicksColored = 2;
              break;
            case 2:
              maxTicksColored = 4;
              break;
            case 4:
              maxTicksColored = 8;
              break;
            case 8:
              maxTicksColored = 16;
              break;
            case 16:
              maxTicksColored = 32;
              break;
            case 32:
              maxTicksColored = 64;
              break;
            case 64:
              maxTicksColored = 128;
              break;
            case 128:
              maxTicksColored = 256;
              break;
            case 256:
              maxTicksColored = 0;
              break;
          }

          for (let y in cells) { // resets all the cells their ticksDead counter
            for (let x in cells[y]) {
              cells[y][x].ticksDead = maxTicksColored + 1;
            }
          }
          break;
      }
      break;
  }
}