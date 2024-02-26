function settingsScene() {
  if (scene !== 'tutorial') {
    if (scene === "settings") {
      scene = "game";
    } else {
      scene = "settings";
    }
  }
}