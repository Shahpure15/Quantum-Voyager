// common/starfield.js
window.addEventListener('load', function() {
    // Check if THREE is available
    if (!window.THREE) {
      console.error("THREE is not defined! Please check your Three.js CDN link.");
      return;
    }
    
    // Get the container element from the HTML.
    const container = document.getElementById('starfield-container');
    if (!container) {
      console.warn('starfield-container not found. Skipping starfield animation.');
      return;
    }
    
    // Create a new Three.js scene.
    const scene = new THREE.Scene();
    
    // Set up the camera with a wide field of view.
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      1, 
      4000
    );
    camera.position.z = 1000;
    
    // Create the renderer with transparency enabled.
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create stars: 10,000 points randomly positioned.
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++){
      positions[i] = (Math.random() * 2 - 1) * 2000;
    }
    
    // Set up the geometry and material for the stars.
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true
    });
    
    // Create the Points mesh (star field) and add it to the scene.
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
    
    // Animation loop: rotate the star field and render the scene.
    function animateStars() {
      requestAnimationFrame(animateStars);
      starField.rotation.y += 0.0005; // Adjust for desired speed
      renderer.render(scene, camera);
    }
    
    // Begin the animation.
    animateStars();
  });
  