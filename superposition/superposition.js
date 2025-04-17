// superposition.js
let scene, camera, renderer;
let particle;
let gui;
let state = { superposition: true, collapse: false };

init();
animate();

function init() {
  const container = document.getElementById('scene-container');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 30;
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Create a particle (a sphere)
  const geometry = new THREE.SphereGeometry(3, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  particle = new THREE.Mesh(geometry, material);
  scene.add(particle);
  
  // Setup dat.GUI for superposition controls
  gui = new dat.GUI();
  gui.add(state, 'superposition').name('Superposition').onChange(toggleState);
  gui.add(state, 'collapse').name('Collapse').onChange(collapseState);
  
  window.addEventListener('resize', onWindowResize);
}

function toggleState(value) {
  // When in superposition, show a semi-transparent, pulsing state
  if (value) {
    particle.material.opacity = 0.5;
    particle.material.transparent = true;
  } else {
    particle.material.opacity = 1;
    particle.material.transparent = false;
  }
}

function collapseState(value) {
  // Simulate wavefunction collapse by changing color
  if (value) {
    particle.material.color.set(0xff0000);
  } else {
    particle.material.color.set(0xffff00);
  }
}

function onWindowResize() {
  const container = document.getElementById('scene-container');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  // Rotate the particle when in superposition mode
  if (state.superposition && !state.collapse) {
    particle.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}
