// ydse.js - Enhanced Young's Double Slit Experiment

// Main simulation variables
let scene, camera, renderer;
let barrier, slits = [], screen;
let particles = [];
let emitter;
let screenData = []; // To store hit positions for pattern building
let intensityData = []; // For the intensity graph
let isObserving = false; // For quantum measurement simulation
let clock = new THREE.Clock();

// Experiment parameters (will be controlled by UI)
const params = {
  particleType: 'photon',
  emissionRate: 50,
  slitCount: 2,
  slitWidth: 5,
  slitDistance: 20,
  screenDistance: 100,
  detectionMode: 'pattern',
  observePath: false
};

// Color settings
const colors = {
  photon: 0xffaa00,
  electron: 0x00aaff,
  observed: 0x00ff00,
  screen: 0x222222,
  barrier: 0x444444,
  slits: 0x000000
};

// Initialize simulation
init();
setupEventListeners();
animate();

// Main initialization function
function init() {
  // Setup Three.js scene
  const container = document.getElementById('scene-container');
  scene = new THREE.Scene();
  
  // Create camera with appropriate position and angle
  camera = new THREE.PerspectiveCamera(
    60, 
    container.clientWidth / container.clientHeight, 
    1, 
    1000
  );
  camera.position.set(0, 0, 150);
  
  // Setup renderer with anti-aliasing
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  
  // Add ambient light for better visibility
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  // Add directional light from camera direction
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.copy(camera.position);
  scene.add(directionalLight);
  
  // Create the experiment components
  createBarrier();
  createScreen();
  createEmitter();
  
  // Initialize particle array
  createParticlePool();
  
  // Initialize intensity data array for the graph
  for (let i = 0; i < 100; i++) {
    intensityData[i] = 0;
  }
  
  // Responsive handling
  window.addEventListener('resize', onWindowResize);
  
  // Start particle emission based on current rate
  startEmission();
}

// Create the barrier with slits
function createBarrier() {
  // Create main barrier (a plane with holes cut out for slits)
  const barrierGeometry = new THREE.PlaneGeometry(60, 40);
  const barrierMaterial = new THREE.MeshPhongMaterial({ 
    color: colors.barrier,
    side: THREE.DoubleSide
  });
  
  barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
  barrier.position.z = 0;
  scene.add(barrier);
  
  // Create the slits (initially double slit)
  updateSlits();
}

// Update the slits based on current parameters
function updateSlits() {
  // Remove any existing slits
  slits.forEach(slit => {
    scene.remove(slit);
  });
  slits = [];
  
  // Calculate positions based on number of slits and distance
  const slitHalfWidth = params.slitWidth / 2;
  
  if (params.slitCount === 1) {
    // Single slit in center
    createSlit(0, slitHalfWidth);
  } 
  else if (params.slitCount === 2) {
    // Double slit configuration
    const halfDistance = params.slitDistance / 2;
    createSlit(-halfDistance, slitHalfWidth);
    createSlit(halfDistance, slitHalfWidth);
  }
  else if (params.slitCount > 2) {
    // Multiple slits (diffraction grating)
    const totalWidth = params.slitDistance * (params.slitCount - 1);
    const startPosition = -totalWidth / 2;
    
    for (let i = 0; i < params.slitCount; i++) {
      const position = startPosition + i * params.slitDistance;
      createSlit(position, slitHalfWidth);
    }
  }
}

// Helper to create individual slit
function createSlit(xPosition, halfWidth) {
  const slitGeometry = new THREE.BoxGeometry(halfWidth * 2, 40, 1);
  const slitMaterial = new THREE.MeshBasicMaterial({ 
    color: colors.slits,
    transparent: true,
    opacity: 0.1
  });
  
  const slit = new THREE.Mesh(slitGeometry, slitMaterial);
  slit.position.set(xPosition, 0, 0);
  scene.add(slit);
  slits.push(slit);
}

// Create detection screen
function createScreen() {
  const screenGeometry = new THREE.PlaneGeometry(100, 60);
  const screenMaterial = new THREE.MeshPhongMaterial({ 
    color: colors.screen,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  });
  
  screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.z = -params.screenDistance;
  scene.add(screen);
  
  // Create a canvas texture for the interference pattern
  updateScreenCanvas();
}

// Update the screen texture based on hit data
function updateScreenCanvas() {
  // This would create and update a dynamic canvas texture 
  // to show the interference pattern on the screen
  // We'll implement this in more detail later
}

// Create the particle emitter
function createEmitter() {
  const emitterGeometry = new THREE.SphereGeometry(3, 16, 8);
  const emitterMaterial = new THREE.MeshPhongMaterial({ 
    color: params.particleType === 'photon' ? colors.photon : colors.electron,
    emissive: params.particleType === 'photon' ? 0x884400 : 0x004488,
    transparent: true,
    opacity: 0.8
  });
  
  emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);
  emitter.position.z = 50; // Position in front of the barrier
  scene.add(emitter);
}

// Pre-create a pool of particles for better performance
function createParticlePool() {
  const poolSize = 200; // Adjust based on maximum emission rate
  
  for (let i = 0; i < poolSize; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.8, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: params.particleType === 'photon' ? colors.photon : colors.electron,
      transparent: true,
      opacity: 0.8
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.visible = false;
    particle.active = false;
    particle.userData = {
      velocity: new THREE.Vector3(),
      age: 0,
      slitPassed: null, // To track which slit it passed through
      observed: false   // To track if it was observed (quantum measurement)
    };
    
    scene.add(particle);
    particles.push(particle);
  }
}

// Start emitting particles
function startEmission() {
  // Use setInterval to emit particles at regular intervals
  // Calculate interval in ms based on emission rate
  const intervalMs = 1000 / params.emissionRate;
  
  if (window.emissionInterval) {
    clearInterval(window.emissionInterval);
  }
  
  window.emissionInterval = setInterval(() => {
    emitParticle();
  }, intervalMs);
}

// Emit a single particle
function emitParticle() {
  // Find an inactive particle from the pool
  const particle = particles.find(p => !p.active);
  if (!particle) return; // All particles in use
  
  // Reset and activate the particle
  particle.visible = true;
  particle.active = true;
  
  // Position at emitter with slight randomness
  particle.position.copy(emitter.position);
  particle.position.x += (Math.random() - 0.5) * 2;
  particle.position.y += (Math.random() - 0.5) * 2;
  
  // Set velocity toward the barrier
  const speed = params.particleType === 'photon' ? 2.0 : 1.5;
  particle.userData.velocity.set(
    (Math.random() - 0.5) * 0.1, // small x spread
    (Math.random() - 0.5) * 0.1, // small y spread
    -speed // moving toward barrier/screen
  );
  
  particle.userData.age = 0;
  particle.userData.slitPassed = null;
  particle.userData.observed = false;
  
  // Set color based on particle type
  particle.material.color.set(
    params.particleType === 'photon' ? colors.photon : colors.electron
  );
}

// Update particle positions and handle collisions
function updateParticles(deltaTime) {
  particles.forEach(particle => {
    if (!particle.active) return;
    
    // Update age
    particle.userData.age += deltaTime;
    
    // Apply velocity
    particle.position.add(
      particle.userData.velocity.clone().multiplyScalar(deltaTime * 60)
    );
    
    // Check for slit passage
    if (particle.position.z <= 0 && particle.position.z > -5 && !particle.userData.slitPassed) {
      handleSlitPassage(particle);
    }
    
    // Check for screen collision
    if (particle.position.z <= screen.position.z) {
      handleScreenCollision(particle);
    }
    
    // Remove particles that go too far off-screen
    if (particle.userData.age > 10 || Math.abs(particle.position.x)