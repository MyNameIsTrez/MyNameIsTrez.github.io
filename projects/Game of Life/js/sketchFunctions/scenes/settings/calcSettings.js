function calcSettings() {
  push();
  let heightModifier = 1;
  textSize(_textSize * 2);
  stroke(colors.black);

  let x = gameWidth / 2 - (textWidth("Settings")) / 2;
  let y = heightModifier * textSize();

  fill(colors.solarizedGray);
  rect(x, y, textWidth("Settings") + 2 * rectTextSpace, textSize() + 2 * rectTextSpace);

  fill(colors.black);
  text("Settings", x + rectTextSpace, y + textSize());
  pop();

  if (settingNumber > 1) { // shows the 2nd previous setting
    previousSettingNumber = settingNumber - 2;
  } else if (settingNumber > 0) {
    previousSettingNumber = Object.keys(settings).length - 1;
  } else {
    previousSettingNumber = Object.keys(settings).length - 2;
  }
  getSetting(previousNextColor, _textSize, previousSettingNumber, -9, false);

  if (settingNumber > 0) { // shows the previous setting
    previousSettingNumber = settingNumber - 1;
  } else {
    previousSettingNumber = Object.keys(settings).length - 1;
  }
  getSetting(previousNextColor, _textSize * 2, previousSettingNumber, -2.5, false);

  getSetting(0, _textSize * 3, settingNumber, 0, true); // shows the currently selected setting

  if (settingNumber < Object.keys(settings).length - 1) { // shows the next setting
    nextSettingNumber = settingNumber + 1;
  } else {
    nextSettingNumber = 0;
  }
  getSetting(previousNextColor, _textSize * 2, nextSettingNumber, 3, false);

  if (settingNumber < Object.keys(settings).length - 2) { // shows the 2nd next setting
    nextSettingNumber = settingNumber + 2;
  } else if (settingNumber < Object.keys(settings).length - 1) {
    nextSettingNumber = 0;
  } else {
    nextSettingNumber = 1;
  }
  getSetting(previousNextColor, _textSize, nextSettingNumber, 11, false);
}