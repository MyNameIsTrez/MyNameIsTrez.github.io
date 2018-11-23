function changeDiff(diff) {
  if (diff < 0 || diff === 0) {
    return diff
  } else if (diff > 0) {
    return '+' + diff
  }
}


function drawGameTexts() {
  texts = [
    `Meals: ${meals} (${changeDiff(mealsDiff)})`,
    `Workers: ${workers} (${changeDiff(workersDiff)})`,
    `Money: $${money} (${changeDiff(moneyDiff)})`,
    `Research: ${research} (${changeDiff(researchDiff)})`,
    `Energy: ${energy} (${changeDiff(energyDiff)})`,
    `Uranium: ${uranium} (${changeDiff(uraniumDiff)})`
  ]

  fill(0);
  noStroke();

  for (var i = 0; i < texts.length; i++) {
    text(texts[i], GUIW / 2 - 40, 30 + i * 20);
  }
}