// create global variables
let camera, scene, renderer;
let cubes;

// assign global variables a starting value
const cameraPos = { x: 14, y: 7, z: 10 };
const rendererSizeReduction = 20;

const cubeCols = 29;
const cubeRows = 15;

// starting the program
threeJsSetup();
create2DCubeArray();
animate();


function threeJsSetup() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.x = cameraPos.x;
  camera.position.y = cameraPos.y;
  camera.position.z = cameraPos.z;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth - rendererSizeReduction, window.innerHeight - rendererSizeReduction);
  document.body.appendChild(renderer.domElement);
}

function getCube(x, y) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const texture = new THREE.TextureLoader().load('textures/' + 'blue' + '.png');
  var material = new THREE.MeshBasicMaterial({ map: texture });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(x, y, 0);

  return cube;
}

function create2DCubeArray() {
  cubes = [];
  for (let x = 0; x < cubeCols; x++) {
    cubes.push([]);
    for (let y = 0; y < cubeRows; y++) {
      cubes[x][y] = getCube(x, y);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}