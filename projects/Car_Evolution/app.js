let state = 'race';

// Race
const carCount = 50;
let drawRays = true;
let drawRayLengths = false;
let cars = [];
let savedCars = [];
let walls = [];
let checkboxRender;
let generation = 0;
let firstPersonView = false;
let mutationRate = 0.2

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
    drawRays = !drawRays;
  });
  createButton('draw ray lengths').mousePressed(function () {
    drawRayLengths = !drawRayLengths;
  });
  // createButton('save best car').mousePressed(saveBestCar);

  // Race
  // Add 5 randomly placed walls.
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
  checkboxFirstPersonView = createCheckbox('first-person view', firstPersonView).changed(changeFirstPersonView);

  const carArgs = [1200, 600, 270, sliderFOV.value(), sliderRayCount.value()];
  for (let i = 0; i < carCount; i++)
    cars.push(new Car(carArgs));

  createCanvas(innerWidth - 21, innerHeight - 97);
}

function draw() {
  switch (state) {
    case 'race':
      raceUpdate();
      break;
    case 'editor':
      editorUpdate();
      break;
  }
}