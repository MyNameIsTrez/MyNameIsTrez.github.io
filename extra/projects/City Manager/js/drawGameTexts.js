function changeDiff(diff) {
  if (diff < 0 || diff === 0) {
    return diff.toLocaleString()
  } else if (diff > 0) {
    return '+' + diff.toLocaleString()
  }
}


function drawGameTexts() {
  texts = [
    `Meals: ${meals.toLocaleString()} (${changeDiff(mealsDiff)})`,
    `Workers: ${workers.toLocaleString()} (${changeDiff(workersDiff)})`,
    `Money: $${money.toLocaleString()} (${changeDiff(moneyDiff)})`,
    `Research: ${research.toLocaleString()} (${changeDiff(researchDiff)})`,
    `Energy: ${energy.toLocaleString()} (${changeDiff(energyDiff)})`,
    `Uranium: ${uranium.toLocaleString()} (${changeDiff(uraniumDiff)})`
  ]

  fill(0);
  noStroke();

  for (var i = 0; i < texts.length; i++) {
    text(texts[i], GUIW / 2 - 40, 30 + i * 20);
  }
}