class AudioPlayer {
    constructor() {
        this.createAudioPlayer();
        this.initializeAudio();
        this.setupEventListeners();
    }

    createAudioPlayer() {
        const playerHtml = `
            <div id="minimal-audio-player" class="fixed bottom-0 left-0 right-0 bg-black/90 h-12 flex items-center px-4 z-50 backdrop-blur-sm">
                <div class="flex items-center gap-3 w-full max-w-screen-2xl mx-auto">
                    <button id="audio-play-pause" class="text-white hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                    <div class="flex-1 flex items-center gap-2">
                        <span id="audio-current-time" class="text-white/60 text-xs w-10">0:00</span>
                        <div class="audio-progress flex-1 h-1 bg-white/10 rounded cursor-pointer">
                            <div id="audio-progress-bar" class="h-full bg-blue-500 rounded" style="width: 0%"></div>
                        </div>
                        <span id="audio-duration" class="text-white/60 text-xs w-10">0:00</span>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-white/60">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        </svg>
                        <input type="range" id="audio-volume" class="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" min="0" max="1" step="0.01" value="0.7">
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', playerHtml);
    }

    initializeAudio() {
        this.audio = new Audio('/workspaces/Quantum-Project/assets/sounds/Interstellar.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.7;
    }

    setupEventListeners() {
        const playPauseBtn = document.getElementById('audio-play-pause');
        const progressBar = document.querySelector('.audio-progress');
        const volumeSlider = document.getElementById('audio-volume');

        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        progressBar.addEventListener('click', (e) => this.seek(e));
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Update play button icon when audio state changes
        this.audio.addEventListener('play', () => {
            playPauseBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        });

        this.audio.addEventListener('pause', () => {
            playPauseBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        });
    }

    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('audio-progress-bar').style.width = `${progress}%`;
        document.getElementById('audio-current-time').textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        document.getElementById('audio-duration').textContent = this.formatTime(this.audio.duration);
    }

    seek(event) {
        const rect = event.target.getBoundingClientRect();
        const pos = (event.clientX - rect.left) / rect.width;
        this.audio.currentTime = pos * this.audio.duration;
    }

    setVolume(value) {
        this.audio.volume = value;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize audio player
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
});
