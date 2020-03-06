function loadScene() {
  if (scene !== 'tutorial') {
    if (scene === "load") {
      scene = "game";
    } else {
      scene = "load";
    }
  }
}