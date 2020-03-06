// Made by MyNameIsTrez
// This is a program to visualize an array of (x, y) points.


const downloadResult = false;
const downloadName = 'points';
const canvasSidesMult = 1.1; // Affects how much empty space there will be on the sides of the canvas.
const consoleLogMaxDistBoolean = false; // Whether to 'console.log()' the max distance between the point coordinates.


// Use your own point coordinates here for your own visualisations!
const points = [
  [656, -597], // This means 'x = 656, y = -597'.
  [-218, -405],
  [-79, -581],
  [226, -701],
  [645, -981],
  [538, -1320],
  [625, -1007],
  [358, -668],
  [-108, -411],
  [83, -584],
  [-62, -367],
  [-328, -266],
  [-343, -140],
  [-332, -309],
  [-261, -751],
  [-76, -307],
  [-473, -325],
  [-722, -116],
  [-621, -308],
  [-606, -336],
  [-318, -662],
  [-41, -1076],
  [-787, -1134],
  [-1125, -1121],
  [-1119, -1112],
  [-577, -1028],
  [-638, -1454],
  [-43, -1881],
  [-664, -2238],
  [-355, -2361],
  [10, -2567],
  [-394, -3007],
  [-1292, -2932],
  [-2219, -3297],
  [-2709, -3286],
  [-2602, -3462],
  [-2810, -3487],
  [-3144, -3941],
  [-3335, -4140],
  [-2833, -3950],
  [-2696, -3875],
  [-2787, -4098],
  [-3031, -4587],
  [-3050, -4665],
  [-2906, -4373],
  [-3290, -4274],
  [-3104, -3752],
  [-3214, -3265],
  [-3328, -3770],
  [-3602, -3114],
  [-3575, -2652],
  [-4128, -3151],
  [-4224, -2873],
  [-4893, -2995],
  [-4944, -2944],
  [-5483, -2586],
  [-5914, -2393],
  [-6330, -1960],
  [-6659, -1225],
  [-6357, -1120],
  [-6305, -668],
  [-6362, -730],
  [-6487, -625],
  [-6583, -1224],
  // [,],
];


function setup() {
  if (consoleLogMaxDistBoolean) {
    console.log('Max distance:', round(getMaxDist()[0]));
  }

  const canvasDimension = min(innerWidth, innerHeight);

  const pointDimension = canvasDimension / canvasSidesMult;

  resizePointCoordinates(pointDimension);

  createCanvas(canvasDimension, canvasDimension);
  background(30);
  
  const offset = (width - pointDimension) / 2;
  translate(offset, offset);
  
  if (consoleLogMaxDistBoolean) {
    showCircleMaxDistPoint();
  }

  showGraph(pointDimension);

  if (downloadResult) {
    save(downloadName);
  }
}


function getMaxDist() {
  let maxDist = 0;
  let maxDistPoint;
  
  for (let i = 0; i < points.length; i++) {
    if (i < points.length - 1) {
      const point = points[i];
      const nextPoint = points[i + 1];
      const dx = point[0] - nextPoint[0];
      const dy = point[1] - nextPoint[1];
      
      const dist = sqrt(dx ** 2 + dy ** 2);
      if (dist > maxDist) {
        maxDist = dist;
        maxDistPoint = point;
      }
    }
  }
  
  return [ maxDist, maxDistPoint ];
}

function showCircleMaxDistPoint() {
  const maxDistResult = getMaxDist();
  const maxDist = maxDistResult[0];
  const maxDistPoint = maxDistResult[1];
  
  const x = maxDistPoint[0];
  const y = maxDistPoint[1];
  const d = maxDist * 2;
  
  noFill();
  stroke(70);
  circle(x, y, d);
}

function resizePointCoordinates(pointDimension) {
  const extremes = getExtreme(points);

  const xRange = abs(extremes[0] - extremes[1]);
  const yRange = abs(extremes[2] - extremes[3]);

  const xDiv = xRange / pointDimension;
  const yDiv = yRange / pointDimension;

  for (const point of points) {
    point[0] /= xDiv;
    point[1] /= yDiv;
  }

  const newExtremes = getExtreme(points);

  for (const point of points) {
    point[0] -= newExtremes[0];
    point[1] -= newExtremes[2];
  }
}

function getExtreme(arr) {
  const xValues = [];
  const yValues = [];

  for (let i = 0; i < 2; i++) {
    for (const point of arr) {
      const val = point[i % 2];
      if (i % 2) {
        yValues.push(val);
      } else {
        xValues.push(val);
      }
    }
  }

  return [
    min(xValues),
    max(xValues),
    min(yValues),
    max(yValues),
  ];
}

function showGraph() {  
  textSize(15);
  strokeWeight(sqrt(textSize()) * 0.8);
                      
  const yTextAddition = textSize() / 3;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    const x = point[0];
    const y = point[1];

    const col = [50, 255 / (points.length / (i + 1)), 150];

    stroke(col);

    if (i < points.length - 1) {
      const pointNext = points[i + 1];
      const xNext = pointNext[0];
      const yNext = pointNext[1];
      line(x, y, xNext, yNext)
    }

    noStroke();
    fill(col);

    circle(x, y, 25);

    stroke(0);
    fill(255);

    const string = i + 1;
    const xText = x - textWidth(string) / 2;
    const yText = y + yTextAddition;

    text(string, xText, yText);
  }
}