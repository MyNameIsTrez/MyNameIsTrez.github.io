// Editable
const carCount = 50;
let mutationRate = 0.25;
let state = 'race';
let booleanDrawRays = true;
let booleanDrawRayLengths = false;
let booleanDrawCheckpoints = true;
let booleanDrawCarPoints = true;
let booleanFirstPersonView = false;

// Not editable
let generation = 0;
let cars = [];
let savedCars = [];
let walls = [];
let checkboxRender;
let scaleFactor, textHeight;

// Read bestRacetracks.js and use the corners
let corners = bestRacetrack;

// Read bestIsometricWalls.js and use the isometric walls.
let isometricWalls = bestIsometricWalls;
for (const i in isometricWalls) {
  const column = isometricWalls[i];
  for (const j in column) {
    const isometricWall = isometricWalls[i][j];
    if (!Array.isArray(isometricWall)) {
      const isoWall = isometricWalls[i][j];
      isometricWalls[i][j] = new IsometricWall(isoWall.posX, isoWall.posY, isoWall.size, isoWall.rgb);
    }
  }
}

for (const i in corners) {
  const c = corners[i];
  const corner = new Corner(c.x, c.y, c.placed, c.checkpoint);
  corners[i] = corner;
}

function setup() {
  // Navigation
  createButton('race').mousePressed(function () {
    state = 'race';
  });
  createButton('editor').mousePressed(function () {
    state = 'editor';
  });
  createButton('draw rays').mousePressed(function () {
    booleanDrawRays = !booleanDrawRays;
  });
  createButton('draw ray lengths').mousePressed(function () {
    booleanDrawRayLengths = !booleanDrawRayLengths;
  });
  createButton('draw car points').mousePressed(function () {
    booleanDrawCarPoints = !booleanDrawCarPoints;
  });
  createButton('draw checkpoints').mousePressed(function () {
    booleanDrawCheckpoints = !booleanDrawCheckpoints;
  });

  // createButton('save best car').mousePressed(saveBestCar);

  // Use the corners to make the walls and checkpoints array.
  for (const i in corners) {
    if (i % 2 === 1) {
      const lastCorner = corners[i - 1];
      const corner = corners[i];
      const x1 = lastCorner.x;
      const y1 = lastCorner.y;
      const x2 = corner.x;
      const y2 = corner.y;
      const checkpoint = corners[i].checkpoint;
      walls.push(new Boundary(x1, y1, x2, y2, checkpoint));
    }
  }

  // Isometric Wall setup
  sliderBackgroundColor = createColorPicker([122, 183, 250]).input(updateIsometricWalls);
  sliderCursorColor = createColorPicker('white').input(updateIsometricWalls);
  // createCanvas(maxPosXCount * isometricWallSize + 3 * isometricWallSize, maxPosYCount * isometricWallSize + 4 * isometricWallSize);
  // createisometricWallsArray();
  updateIsometricWalls();

  sliderFOV = createSlider(1, 360, 360).input(function () {
    const fov = sliderFOV.value();
    for (const car of cars) {
      car.updateFOV(fov);
    }
  });
  sliderRayCount = createSlider(1, 179, 45).input(function () {
    const rayCount = sliderRayCount.value();
    for (const car of cars) {
      car.updateRayCount(rayCount);
    }
  });
  checkboxFirstPersonView = createCheckbox('first-person view', booleanFirstPersonView).changed(changeFirstPersonView);

  const carArgs = [1200, 600, 270, sliderFOV.value(), sliderRayCount.value()];
  for (let i = 0; i < carCount; i++)
    cars.push(new Car(carArgs));

  createCanvas(innerWidth - 21, innerHeight - 97);
  // Make a scalefactor that has 2 decimals.
  scaleFactor = floor(100 * min((width / (isometricWalls.length + 3)) / isometricWallSize, (height / (isometricWalls[0].length + 3 + 4)) / isometricWallSize)) / 100;

  textHeight = (isometricWalls[0].length + 4) * isometricWallSize;
}

function draw() {
  scale(scaleFactor);
  switch (state) {
    case 'race':
      raceUpdate();
      break;
    case 'editor':
      editorUpdate();
      break;
  }
}