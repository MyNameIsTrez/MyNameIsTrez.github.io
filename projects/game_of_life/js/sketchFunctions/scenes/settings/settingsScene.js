function settingsScene() {
  if (scene !== 'tutorial') {
    if (scene === "settings") {
      for (let y in cells) { // resets all the cells their ticksDead counter
        for (let x in cells[y]) {
          cells[y][x].ticksDead = maxTicksColored + 1;
        }
      }

      scene = "game";
    } else {
      scene = "settings";
    }
  }
}