// entanglement.js
let scene, camera, renderer;
let particleA, particleB, entangleLine;
let gui;
let entangledState = { spinA: "up", spinB: "down", superposition: false };

init();
animate();

function init() {
  const container = document.getElementById('scene-container');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 50;
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Create two particles (represented as spheres)
  const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
  const materialA = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const materialB = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  
  particleA = new THREE.Mesh(sphereGeometry, materialA);
  particleA.position.x = -10;
  scene.add(particleA);
  
  particleB = new THREE.Mesh(sphereGeometry, materialB);
  particleB.position.x = 10;
  scene.add(particleB);
  
  // Create a connecting line to represent entanglement
  const points = [particleA.position, particleB.position];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
  entangleLine = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(entangleLine);
  
  // Setup dat.GUI controls
  gui = new dat.GUI();
  gui.add(entangledState, 'spinA', ['up', 'down']).name('Spin A').onChange(updateSpin);
  gui.add(entangledState, 'superposition').name('Superposition').onChange(toggleSuperposition);
  
  document.getElementById('reset-btn').addEventListener('click', resetState);
  
  window.addEventListener('resize', onWindowResize);
}

function updateSpin(value) {
  // Adjust colors based on spin setting
  if (value === 'up') {
    particleA.material.color.set(0x00ff00);
    particleB.material.color.set(0xff0000);
    entangledState.spinB = 'down';
  } else {
    particleA.material.color.set(0xff0000);
    particleB.material.color.set(0x00ff00);
    entangledState.spinB = 'up';
  }
}

function toggleSuperposition(value) {
  // Visualize superposition via transparency effects
  if (value) {
    particleA.material.opacity = 0.5;
    particleA.material.transparent = true;
    particleB.material.opacity = 0.5;
    particleB.material.transparent = true;
  } else {
    particleA.material.opacity = 1;
    particleA.material.transparent = false;
    particleB.material.opacity = 1;
    particleB.material.transparent = false;
  }
}

function resetState() {
  entangledState.spinA = 'up';
  entangledState.spinB = 'down';
  entangledState.superposition = false;
  gui.updateDisplay();
  updateSpin(entangledState.spinA);
  toggleSuperposition(false);
}

function onWindowResize() {
  const container = document.getElementById('scene-container');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  // Ensure the connecting line updates with particle positions
  const points = [particleA.position, particleB.position];
  entangleLine.geometry.setFromPoints(points);
  renderer.render(scene, camera);
}
