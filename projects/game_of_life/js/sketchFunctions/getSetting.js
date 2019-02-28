function getSetting(settingStroke, settingTextSize, settingNumber, heightModifier, fillColor) {
  let setting = settings[settingNumber];
  let info = getSettingInfo(setting);

  push();
  stroke(settingStroke);
  textSize(settingTextSize);

  let x = gameWidth / 2 - (textWidth(setting + info)) / 2;
  let y = gameHeight / 2 + heightModifier * textSize();

  drawSetting(x, y, setting, info, fillColor);
  pop();
}

function getSettingInfo(setting) {
  let info = ``;
  switch (setting) {
    case `loop edges: `:
      info = loopEdges;
      break;
    case `draw grid paused: `:
      info = drawGridPaused;
      break;
    case `draw grid playing: `:
      info = drawGridPlaying;
      break;
    case `game mode: `:
      info = gameMode;
      break;
    case `cell tick rate: `:
      info = cellTickRate;
      break;
    case `cell width count: `:
      info = cellWidthCount;
      break;
    case `cell height count: `:
      info = cellHeightCount;
      break;
    case `max ticks colored: `:
      info = maxTicksColored;
      break;
  }
  return info;
}