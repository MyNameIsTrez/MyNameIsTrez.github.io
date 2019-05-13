let state = 'race';

// Race
const carCount = 50;
let drawRays = true;
let cars = [];
let savedCars = [];
let walls = [];
let checkboxRender;
let generation = 0;
let renderRayCasting = false;

// Read racetracks.js and use the corners
let corners = newRacetrack;
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
  createButton('save best car').mousePressed(saveBestCar);

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
  sliderFOV = createSlider(1, 180, 180).input(function () {
    const fov = sliderFOV.value();
    for (const car of cars) {
      car.updateFOV(fov);
    }
  });
  sliderRayCount = createSlider(1, 180, 9).input(function () {
    const rayCount = sliderRayCount.value();
    for (const car of cars) {
      car.updateRayCount(rayCount);
    }
  });
  checkboxRenderRayCasting = createCheckbox('render ray casting', true).changed(changeRenderRayCasting);

  const carArgs = [800, 600, 270, sliderFOV.value(), sliderRayCount.value()];
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