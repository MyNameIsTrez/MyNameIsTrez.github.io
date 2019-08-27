// create global variables
let camera, scene, renderer;
let cube;

// assign global variables a starting value
const cameraPosZ = 5;
const rendererSizeReduction = 20;


function setup() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = cameraPosZ;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth - rendererSizeReduction, window.innerHeight - rendererSizeReduction);
  document.body.appendChild(renderer.domElement);
}

function addCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}


setup();
addCube();
animate();