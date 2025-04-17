// Initialize ThreeJS Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create a starfield background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 1
});

const starsVertices = [];
for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create atom
const atomGroup = new THREE.Group();
scene.add(atomGroup);

// Add translucent outer covering (atomic boundary)
const outerShellRadius = 12;
const atomicBoundaryGeometry = new THREE.SphereGeometry(outerShellRadius, 32, 32);
const atomicBoundaryMaterial = new THREE.MeshPhongMaterial({
    color: 0x3498db,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    depthWrite: false,
    wireframe: true
});
const atomicBoundary = new THREE.Mesh(atomicBoundaryGeometry, atomicBoundaryMaterial);
atomGroup.add(atomicBoundary);

// Nucleus
const nucleusGroup = new THREE.Group();
atomGroup.add(nucleusGroup);

// Add protons and neutrons to nucleus (Carbon has 6 protons and 6 neutrons)
const nucleonRadius = 0.4;

// Create protons
for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const radius = 0.7;
    
    const protonGeometry = new THREE.SphereGeometry(nucleonRadius, 16, 16);
    const protonMaterial = new THREE.MeshPhongMaterial({
        color: 0xff4444,
        emissive: 0xff0000,
        emissiveIntensity: 0.2,
        shininess: 30
    });
    
    const proton = new THREE.Mesh(protonGeometry, protonMaterial);
    proton.position.x = Math.cos(angle) * radius;
    proton.position.y = Math.sin(angle) * radius;
    proton.position.z = (Math.random() - 0.5) * 0.8;
    
    nucleusGroup.add(proton);
}

// Create neutrons
for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI/6;
    const radius = 0.7;
    
    const neutronGeometry = new THREE.SphereGeometry(nucleonRadius, 16, 16);
    const neutronMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        emissive: 0x666666,
        emissiveIntensity: 0.1,
        shininess: 30
    });
    
    const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
    neutron.position.x = Math.cos(angle) * radius;
    neutron.position.y = Math.sin(angle) * radius;
    neutron.position.z = (Math.random() - 0.5) * 0.8;
    
    nucleusGroup.add(neutron);
}

// Carbon electron configuration: 1s² 2s² 2p²
// First shell (K): 2 electrons (1s²)
// Second shell (L): 4 electrons (2s² 2p²)

// Create electron shells
// K shell (n=1)
const kShellRadius = 4;
const kShellGeometry = new THREE.TorusGeometry(kShellRadius, 0.03, 8, 50);
const shellMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x3399ff,
    transparent: true,
    opacity: 0.4
});

const kShell = new THREE.Mesh(kShellGeometry, shellMaterial);
kShell.rotation.x = Math.PI / 2;
atomGroup.add(kShell);

// Second orbital plane for K shell
const kShell2 = new THREE.Mesh(kShellGeometry, shellMaterial);
kShell2.rotation.x = Math.PI / 2;
kShell2.rotation.y = Math.PI / 2;
atomGroup.add(kShell2);

// L shell (n=2)
const lShellRadius = 8;
const lShellGeometry = new THREE.TorusGeometry(lShellRadius, 0.03, 8, 50);

const lShell = new THREE.Mesh(lShellGeometry, shellMaterial);
lShell.rotation.x = Math.PI / 2;
atomGroup.add(lShell);

// Second orbital plane for L shell
const lShell2 = new THREE.Mesh(lShellGeometry, shellMaterial);
lShell2.rotation.x = Math.PI / 2;
lShell2.rotation.y = Math.PI / 3;
atomGroup.add(lShell2);

// Third orbital plane for L shell (p orbital)
const lShell3 = new THREE.Mesh(lShellGeometry, shellMaterial);
lShell3.rotation.x = Math.PI / 2;
lShell3.rotation.y = Math.PI * 2/3;
atomGroup.add(lShell3);

// Create electrons
const electrons = [];
const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);

// Create electron cloud appearance
const cloudMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.5
});

const electronMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ccff,
    emissive: 0x0088ff,
    emissiveIntensity: 0.5,
    shininess: 30
});

// Cloud for K shell (1s orbital)
const kCloudGeometry = new THREE.SphereGeometry(kShellRadius, 16, 16);
const kCloud = new THREE.Mesh(kCloudGeometry, cloudMaterial);
atomGroup.add(kCloud);

// Clouds for L shell (2s and 2p orbitals)
// 2s orbital (spherical)
const lsCloudGeometry = new THREE.SphereGeometry(lShellRadius - 1, 16, 16);
const lsCloud = new THREE.Mesh(lsCloudGeometry, cloudMaterial);
lsCloud.material.opacity = 0.2;
atomGroup.add(lsCloud);

// 2p orbital (dumbbell shapes - simplified)
const createPOrbital = (axis, rotation) => {
    const pGeometry = new THREE.SphereGeometry(2, 16, 16);
    pGeometry.scale(1, 1, 0.5);
    const pOrbital = new THREE.Mesh(pGeometry, cloudMaterial);
    pOrbital.material.opacity = 0.2;
    pOrbital.position[axis] = lShellRadius - 2;
    pOrbital.rotation.set(...rotation);
    atomGroup.add(pOrbital);
    
    const pOrbital2 = new THREE.Mesh(pGeometry, cloudMaterial);
    pOrbital2.material.opacity = 0.2;
    pOrbital2.position[axis] = -(lShellRadius - 2);
    pOrbital2.rotation.set(...rotation);
    atomGroup.add(pOrbital2);
};

createPOrbital('x', [0, 0, 0]);
createPOrbital('y', [0, 0, Math.PI/2]);

// K shell electrons (1s²) - 2 electrons
for (let i = 0; i < 2; i++) {
    const angle = (i / 2) * Math.PI * 2;
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    
    electron.userData = {
        shell: 'K',
        orbital: '1s',
        radius: kShellRadius,
        initialAngle: angle,
        speed: 0.01,
        angularPosition: angle,
        orbitalPlane: i % 2 // Alternate between orbital planes
    };
    
    electrons.push(electron);
    atomGroup.add(electron);
}

// L shell electrons (2s² 2p²) - 4 electrons
// 2s electrons (2)
for (let i = 0; i < 2; i++) {
    const angle = (i / 2) * Math.PI * 2;
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    
    electron.userData = {
        shell: 'L',
        orbital: '2s',
        radius: lShellRadius - 1,
        initialAngle: angle,
        speed: 0.008,
        angularPosition: angle,
        orbitalPlane: i % 2 // Alternate between orbital planes
    };
    
    electrons.push(electron);
    atomGroup.add(electron);
}

// 2p electrons (2)
for (let i = 0; i < 2; i++) {
    const angle = (i / 2) * Math.PI * 2;
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    
    electron.userData = {
        shell: 'L',
        orbital: '2p',
        radius: lShellRadius,
        initialAngle: angle,
        speed: 0.007,
        angularPosition: angle,
        orbitalPlane: i + 2 // Use the third orbital plane for p electrons
    };
    
    electrons.push(electron);
    atomGroup.add(electron);
}

// Wave effect for electrons (show wave-particle duality)
const waveGeometry = new THREE.RingGeometry(0.2, 0.5, 16);
const waveMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ccff,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
});

const electronWaves = [];

electrons.forEach(electron => {
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.userData = {
        parentElectron: electron,
        life: 0
    };
    electronWaves.push(wave);
    scene.add(wave);
});

// Setup camera controls
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

let cameraDistance = 30;
let targetCameraDistance = 30;
camera.position.z = cameraDistance;

// Event listeners
document.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
    };
    
    const rotationSpeed = 0.005;
    atomGroup.rotation.y += deltaMove.x * rotationSpeed;
    atomGroup.rotation.x += deltaMove.y * rotationSpeed;
    
    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
});

document.addEventListener('wheel', (e) => {
    // Zoom in/out with mouse wheel
    const zoomSensitivity = 0.05;
    targetCameraDistance += e.deltaY * zoomSensitivity;
    
    // Clamp camera distance
    targetCameraDistance = Math.max(2, Math.min(60, targetCameraDistance));
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Button click handlers
document.getElementById('btn-entanglement').addEventListener('click', () => {
    window.location.href = 'entanglement/entanglement.html';
});

document.getElementById('btn-superposition').addEventListener('click', () => {
    window.location.href = 'superposition/superposition.html';
});

document.getElementById('btn-ydse').addEventListener('click', () => {
    window.location.href = 'ydse/ydse.html';
});

// Animation loop with frame rate control
let lastFrameTime = 0;
const targetFPS = 30;
const frameInterval = 1000 / targetFPS;

// Scale indicator values
const scaleRanges = [
    { threshold: 5, scale: "1:10⁻¹⁵ m (femtometer/fermi)", description: "Quarks and gluons scale" },
    { threshold: 8, scale: "1:10⁻¹⁴ m", description: "Proton/neutron scale" },
    { threshold: 15, scale: "1:10⁻¹² m (picometer)", description: "Nucleus scale" },
    { threshold: 30, scale: "1:10⁻¹⁰ m (angstrom)", description: "Atomic scale" },
    { threshold: 60, scale: "1:10⁻⁹ m (nanometer)", description: "Molecular scale" }
];

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Control frame rate
    if (currentTime - lastFrameTime < frameInterval) return;
    lastFrameTime = currentTime;
    
    // Rotate nucleus slightly to show quantum dynamics
    nucleusGroup.rotation.x += 0.001;
    nucleusGroup.rotation.y += 0.0015;
    
    // Update electron positions
    electrons.forEach((electron, index) => {
        const data = electron.userData;
        data.angularPosition += data.speed;
        
        // Calculate position based on the orbital plane
        if (data.orbitalPlane === 0) {
            electron.position.x = Math.cos(data.angularPosition) * data.radius;
            electron.position.y = Math.sin(data.angularPosition) * data.radius;
            electron.position.z = 0;
        } else if (data.orbitalPlane === 1) {
            electron.position.x = Math.cos(data.angularPosition) * data.radius;
            electron.position.y = 0;
            electron.position.z = Math.sin(data.angularPosition) * data.radius;
        } else {
            electron.position.x = 0;
            electron.position.y = Math.cos(data.angularPosition) * data.radius;
            electron.position.z = Math.sin(data.angularPosition) * data.radius;
        }
        
        // Update wave effect
        const wave = electronWaves[index];
        if (Math.random() < 0.01) { // Occasionally show wave effect
            wave.position.copy(electron.position);
            wave.rotation.copy(electron.rotation);
            wave.visible = true;
            wave.userData.life = 1.0;
            wave.scale.set(1, 1, 1);
        }
        
        if (wave.userData.life > 0) {
            wave.userData.life -= 0.03;
            wave.scale.x = wave.scale.y = wave.scale.z = 1 + (1 - wave.userData.life) * 3;
            wave.material.opacity = wave.userData.life * 0.7;
            if (wave.userData.life <= 0) {
                wave.visible = false;
            }
        }
    });
    
    // Smooth camera zoom
    cameraDistance += (targetCameraDistance - cameraDistance) * 0.05;
    camera.position.z = cameraDistance;
    
    // Update zoom and scale indicators
    const zoomLevel = (30 / cameraDistance).toFixed(1);
    document.getElementById('zoom-level').textContent = zoomLevel + 'x';
    
    // Update scale indicator based on zoom level
    let currentScale = scaleRanges[scaleRanges.length - 1];
    for (const range of scaleRanges) {
        if (cameraDistance <= range.threshold) {
            currentScale = range;
            break;
        }
    }
    
    document.getElementById('scale-text').textContent = currentScale.scale;
    
    // Update the opacity of the atomic boundary based on zoom
    const boundaryOpacityThreshold = 20;
    if (cameraDistance < boundaryOpacityThreshold) {
        const opacity = 0.15 * (cameraDistance / boundaryOpacityThreshold);
        atomicBoundary.material.opacity = opacity;
    } else {
        atomicBoundary.material.opacity = 0.15;
    }
    
    renderer.render(scene, camera);
}

// Start animation
animate();

// Handle overlay toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const overlayToggle = document.getElementById('overlay-toggle');
    const introOverlay = document.getElementById('intro-overlay');
    const switchElement = document.querySelector('.switch');
    
    // Function to hide overlay and show corner button
    function hideOverlay() {
        // Add class to start fade out animation
        introOverlay.classList.add('hidden');
        
        // Wait for the overlay fade out to complete
        setTimeout(function() {
            introOverlay.style.display = 'none';
            
            // Create a clone of the switch to move to the corner
            const switchClone = switchElement.cloneNode(true);
            switchClone.classList.add('side-position');
            switchClone.id = 'side-switch';
            document.body.appendChild(switchClone);
            
            // Set up event listener for the cloned switch
            const clonedToggle = switchClone.querySelector('input');
            clonedToggle.checked = true;
            clonedToggle.addEventListener('change', function() {
                if (!this.checked) {
                    // Remove the cloned switch
                    document.body.removeChild(switchClone);
                    
                    // Show the overlay again
                    introOverlay.style.display = 'flex';
                    overlayToggle.checked = false;
                    setTimeout(function() {
                        introOverlay.classList.remove('hidden');
                    }, 10);
                }
            });
        }, 500);
    }
    
    // Function to show overlay and hide corner button
    function showOverlay() {
        const sideSwitch = document.getElementById('side-switch');
        if (sideSwitch) {
            document.body.removeChild(sideSwitch);
        }
        
        introOverlay.style.display = 'flex';
        overlayToggle.checked = false;
        setTimeout(function() {
            introOverlay.classList.remove('hidden');
        }, 10);
    }
    
    // Toggle button event
    overlayToggle.addEventListener('change', function() {
        if (this.checked) {
            hideOverlay();
        }
    });
    
    // ESC key event
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (!introOverlay.classList.contains('hidden')) {
                overlayToggle.checked = true;
                hideOverlay();
            }
        }
    });
});