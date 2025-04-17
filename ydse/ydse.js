// ydse.js
let scene, camera, renderer;
let slitLeft, slitRight, screen;
let particles = [];
const particleCount = 200;
let particleIndex = 0;

init();
animate();

function init() {
  const container = document.getElementById('scene-container');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 1, 1000);
  camera.position.set(0, 0, 100);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Create two slits using thin boxes
  const slitGeometry = new THREE.BoxGeometry(1, 10, 0.5);
  const slitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  slitLeft = new THREE.Mesh(slitGeometry, slitMaterial);
  slitLeft.position.set(-5, 0, 0);
  scene.add(slitLeft);
  
  slitRight = new THREE.Mesh(slitGeometry, slitMaterial);
  slitRight.position.set(5, 0, 0);
  scene.add(slitRight);
  
  // Create a screen (a plane) to detect particles
  const screenGeometry = new THREE.PlaneGeometry(50, 30);
  const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
  screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.z = -30;
  scene.add(screen);
  
  // Create particles representing photons/electrons
  const particleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  
  for(let i = 0; i < particleCount; i++){
    let p = new THREE.Mesh(particleGeometry, particleMaterial);
    p.visible = false;
    scene.add(p);
    particles.push(p);
  }
  
  window.addEventListener('resize', onWindowResize);
  
  // Emit particles at regular intervals
  setInterval(emitParticle, 50);
}

function emitParticle() {
  if(particleIndex >= particles.length) {
    particleIndex = 0; // Loop through particles continuously
  }
  let p = particles[particleIndex];
  p.visible = true;
  // Randomly select one of the two slits as the source
  let fromSlit = Math.random() < 0.5 ? slitLeft.position.x : slitRight.position.x;
  p.position.set(fromSlit, (Math.random() - 0.5) * 2, 0);
  p.userData = { velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, -0.5) };
  particleIndex++;
}

function onWindowResize() {
  const container = document.getElementById('scene-container');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  particles.forEach(p => {
    if(p.visible) {
      p.position.add(p.userData.velocity);
      // When particle reaches the screen, simulate detection by stopping its motion
      if(p.position.z < screen.position.z + 1) {
        p.userData.velocity.set(0, 0, 0);
        p.material.color.set(0x00ff00);
      }
    }
  });
  renderer.render(scene, camera);
}