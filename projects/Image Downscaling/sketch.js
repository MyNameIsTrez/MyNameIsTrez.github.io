// Editable

const colorCount = 94;

const eightIdealClrs = false;

const maxGensPerFrame = 1000;

let debugText = false;

const width = innerWidth;
const height = innerHeight;

// Not editable

let img;

let colors;

let largestDiff = 0;
let largestDiffColors;

const startTime = new Date().getTime();

let generation = 0;

function preload() {
  img = loadImage("colorful.jpg");
}

function setup() {
  createCanvas(width, height);
  textSize(50);
  stroke(0);
  fill(255);
  img.resize(width, height);
  img.loadPixels()
}

function draw() {
  for (let _ = 0; _ < maxGensPerFrame; _++) {
    generateColors(colorCount);
    generation++;
  }
}

function generateColors(colorCount) {
  if (eightIdealClrs) {
    // Good color palette
    // Smallest diff is 65025 = 255^2
    colors = [
      [0, 0, 0],
      [0, 0, 255],
      [0, 255, 0],
      [0, 255, 255],
      [255, 0, 0],
      [255, 0, 255],
      [255, 255, 0],
      [255, 255, 255],
    ];
  } else {
    // Create random colors
    colors = [];
    for (let _ = 0; _ < colorCount; _++) {
      colors.push([
        round(random(255)),
        round(random(255)),
        round(random(255))
      ]);
    }
  }

  // Get the smallest distance between two colors
  let smallestDiff = Infinity;
  for (let i = 0; i < colors.length - 1; i++) {
    for (let j = 1; j < colors.length; j++) {
      if (i === j) {
        continue;
      }
      const clr1 = colors[i];
      const clr2 = colors[j];
      const diff =
        (clr1[0] - clr2[0]) ** 2 +
        (clr1[1] - clr2[1]) ** 2 +
        (clr1[2] - clr2[2]) ** 2;
      if (diff < smallestDiff) {
        smallestDiff = diff;
      }
    }
  }

  // If the color palette has a better distribution than a previous one, show it
  if (smallestDiff > largestDiff) {
    largestDiff = smallestDiff;
    largestDiffColors = colors;
    changeImgCopy(); // Comment this out to see the original picture

    if (debugText) {
      const endTime = new Date().getTime();
      const msDiff = endTime - startTime;
      const gensPerSec = round(generation / msDiff * 1000);
      const secsSinceStart = round(msDiff / 1000) + " secs since start";

      text("colors: " + colorCount, 7, 50);
      text(largestDiff + " score", 7, 100);
      text(secsSinceStart, 7, 150);
      text(gensPerSec + "/" + maxGensPerFrame * 60 + " gens/sec", 7, 200);
      text("press 'd' to toggle debug info", 7, 250);
    }
  }
}

function getImgCopy() {
  const imgCopy = createImage(img.width, img.height);
  imgCopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  return imgCopy;
}

function changeImgCopy() {
  const imgCopy = getImgCopy();

  imgCopy.loadPixels()
  for (let i = 0; i < imgCopy.pixels.length; i += 4) {
    const r = imgCopy.pixels[i + 0];
    const g = imgCopy.pixels[i + 1];
    const b = imgCopy.pixels[i + 2];

    let smallestDiff = Infinity,
      smallestDiffIndex;
    for (let i = 0; i < largestDiffColors.length; i++) {
      const clr = largestDiffColors[i];
      const diff =
        (r - clr[0]) ** 2 +
        (g - clr[1]) ** 2 +
        (b - clr[2]) ** 2;
      if (diff < smallestDiff) {
        smallestDiff = diff;
        smallestDiffIndex = i;
      }
    }

    const closestColor = largestDiffColors[smallestDiffIndex];
    imgCopy.pixels[i + 0] = closestColor[0];
    imgCopy.pixels[i + 1] = closestColor[1];
    imgCopy.pixels[i + 2] = closestColor[2];
  }
  imgCopy.updatePixels();

  image(imgCopy, 0, 0);
}

function keyPressed() {
  switch (key) {
    case "s":
      saveJSON(largestDiffColors, "palette");
      break;
    case "d":
      debugText = !debugText;
      break;
  }
}