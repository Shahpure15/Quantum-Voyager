// common/audio-manager.js
if (typeof Tone !== 'undefined') {
    Tone.Transport.start();
    
    // Background ambient loop
    const ambience = new Tone.Player({
      url: '../assets/sounds/Interstellar.mp3',
      loop: true,
      autostart: true,
      volume: 12
    }).toDestination();
    
    // Function to play wormhole flash effect
    function playWormholeFlash() {
      const flash = new Tone.Player({
        url: '../assets/audio/wormhole-flash.mp3',
        autostart: true,
        volume: -6
      }).toDestination();
    }
    
    // Expose the function globally if needed
    window.playWormholeFlash = playWormholeFlash;
  }
  