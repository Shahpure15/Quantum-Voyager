class AudioPlayer {
    constructor() {
        this.createAudioPlayer();
        this.initializeAudio();
        this.setupEventListeners();
        this.loadSettings();
    }

    createAudioPlayer() {
        const playerHtml = `
            <div id="minimal-audio-player" class="fixed bottom-0 left-0 right-0 bg-black/95 h-8 flex items-center px-2 z-50 border-t border-white/10">
                <div class="flex items-center gap-2 w-full max-w-screen-2xl mx-auto">
                    <button id="audio-play-pause" class="text-white/80 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                    <div class="flex-1 flex items-center gap-2">
                        <span id="audio-current-time" class="text-white/60 text-xs w-8 font-mono">0:00</span>
                        <div class="audio-progress flex-1 h-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                            <div id="audio-progress-bar" class="h-full bg-white rounded-full transition-all"></div>
                        </div>
                        <span id="audio-duration" class="text-white/60 text-xs w-8 font-mono">0:00</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="audio-volume-btn" class="text-white/60 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                        </button>
                        <input type="range" id="audio-volume" class="w-16 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" min="0" max="1" step="0.01" value="0.7">
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', playerHtml);
    }

    initializeAudio() {
        this.audio = new Audio('../assets/sounds/Interstellar.mp3');
        this.audio.loop = true;
        
        // Start at 2 minutes (120 seconds)
        this.audio.addEventListener('loadedmetadata', () => {
            this.audio.currentTime = 40;
        });
    }

    loadSettings() {
        const savedVolume = localStorage.getItem('quantum-voyager-volume');
        if (savedVolume !== null) {
            this.audio.volume = parseFloat(savedVolume);
            document.getElementById('audio-volume').value = savedVolume;
        } else {
            this.audio.volume = 0.7;
        }

        const isPlaying = localStorage.getItem('quantum-voyager-playing') === 'true';
        if (isPlaying) {
            this.audio.play();
        }
    }

    setupEventListeners() {
        const playPauseBtn = document.getElementById('audio-play-pause');
        const progressBar = document.querySelector('.audio-progress');
        const volumeSlider = document.getElementById('audio-volume');
        const volumeBtn = document.getElementById('audio-volume-btn');

        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        progressBar.addEventListener('click', (e) => this.seek(e));
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        let lastVolume = this.audio.volume;
        volumeBtn.addEventListener('click', () => {
            if (this.audio.volume > 0) {
                lastVolume = this.audio.volume;
                this.setVolume(0);
            } else {
                this.setVolume(lastVolume);
            }
        });

        this.audio.addEventListener('volumechange', () => {
            this.updateVolumeIcon(volumeBtn);
        });

        // Update play button icon when audio state changes
        this.audio.addEventListener('play', () => {
            localStorage.setItem('quantum-voyager-playing', 'true');
            playPauseBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        });

        this.audio.addEventListener('pause', () => {
            localStorage.setItem('quantum-voyager-playing', 'false');
            playPauseBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        });
    }

    updateVolumeIcon(volumeBtn) {
        const volume = this.audio.volume;
        let icon;
        
        if (volume === 0) {
            icon = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        } else {
            // Just use a single minimal volume icon for both low and high volume
            icon = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';
        }
        
        volumeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">${icon}</svg>`;
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
        localStorage.setItem('quantum-voyager-volume', value);
        document.getElementById('audio-volume').value = value;
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
