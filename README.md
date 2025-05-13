# Quantum Voyager

## Overview
Quantum Voyager is an interactive web platform for exploring quantum mechanics concepts through immersive 3D simulations. It features modules for Quantum Entanglement, Quantum Computing, and the Young's Double-Slit Experiment (YDSE), all with modern UI, responsive design, and educational interactivity.

## Features

- **Quantum Entanglement Simulation**: Visualize entangled particles, manipulate their quantum properties (spin, energy, momentum, phase, axis), and observe real-time correlations. Drag particles in 3D, toggle entanglement, and see Bell state effects.
- **Quantum Computing Lab**: Experiment with qubits, quantum gates, and the Bloch Sphere. Build and run quantum circuits interactively, visualize state vectors, and measure qubits. Includes drag-and-drop circuit builder and real-time Bloch sphere updates.
- **Young's Double-Slit Experiment (YDSE)**: Observe wave-particle duality and interference patterns using an embedded PhET simulation. Adjust experiment parameters and see live results.
- **Clean URLs**: Navigate using `/entanglement`, `/computing`, and `/ydse` for a professional, user-friendly experience (handled via Netlify `_redirects`).
- **Modern Audio Player**: Integrated soundbar with the track "Cornfield Chase | Interstellar" displayed before the time. Audio state is preserved across navigation.
- **Consistent Navigation**: All modules feature a unified "Home" button with a modern, circular design and smooth navigation.
- **Responsive Design**: Optimized for desktop and mobile devices. Layouts adapt for usability and clarity.
- **Interactive Controls**: Adjust quantum parameters with sliders, toggles, and dropdowns. Tooltips provide educational context.
- **SPA-Ready Structure**: Easily adaptable for single-page application routing if desired.
- **Accessibility**: Keyboard navigation and ARIA labels for improved accessibility.

## Recent Improvements

- **UI Consistency**: Home button style and behavior unified across all modules. YDSE Home button is now circular.
- **Soundbar Enhancement**: Song name "Cornfield Chase | Interstellar" is now displayed before the time in the audio player on all pages.
- **Entanglement Module**:
  - Floating property labels no longer block canvas interactions.
  - Particle dragging is disabled when the simulation is paused.
- **YDSE Module**:
  - Home button updated for style consistency.
  - Button is now more circular for a modern look.
- **Netlify Clean URLs**:  
  `_redirects` file added for pretty URLs:
  ```
  /entanglement    /entanglement/entanglement.html   200
  /computing       /computing/computing.html         200
  /ydse            /ydse/ydse.html                   200
  /                /index.html                       200
  ```
- **Codebase Organization**:  
  - Shared utilities and audio logic moved to `common/`.
  - Modular structure for each simulation.
- **Accessibility & Responsiveness**: Improved ARIA labels, keyboard navigation, and mobile layouts.

## Project Structure

```
Quantum-Voyager/
├── index.html
├── _redirects
├── styles.css
├── script.js
├── assets/
│   ├── images/
│   ├── sounds/
│   └── guides/
├── common/
│   ├── audio-player.js
│   ├── audio-manager.js
│   ├── starfield.js
│   ├── ui-controls.js
│   └── utils.js
├── entanglement/
│   └── entanglement.html
├── computing/
│   └── computing.html
├── ydse/
│   └── ydse.html
└── README.md
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge)
- Node.js and npm (for local development)

### Installation

```bash
git clone https://github.com/Shahpure15/Quantum-Voyager.git
cd Quantum-Voyager
npm install
```

### Running Locally

> **Note:** This project uses `live-server` for local development. If you see an error about `live-server` not being recognized, install it with:
> ```bash
> npm install --save-dev live-server
> ```
> or globally:
> ```bash
> npm install -g live-server
> ```

```bash
npm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Use the navigation buttons to switch between modules (Home, Entanglement, Computing, YDSE).
- Interact with controls and sliders to explore quantum phenomena in real time.
- Enjoy background music with the integrated soundbar (song name always visible).
- Drag and manipulate 3D objects where available.
- Tooltips and info panels provide educational context for each control.

## Deployment

- Deploy to Netlify for clean URLs and static hosting.
- The `_redirects` file ensures pretty URLs for all modules.
- No server-side code required; fully static and fast.

## Contributing

We welcome contributions from the open-source community! Please follow these steps:

1. Fork the repository at <a href="https://github.com/Shahpure15/Quantum-Voyager" target="_blank" class="repo-link">github.com/Shahpure15/Quantum-Voyager</a>
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Describe your change"`
4. Push to your branch: `git push origin feature-name`
5. Open a pull request.

### Code of Conduct

We are committed to fostering a welcoming and respectful community for everyone. Please read and follow our <a href="https://github.com/Shahpure15/Quantum-Voyager/blob/main/CODE_OF_CONDUCT.md" class="repo-link" target="_blank">Code of Conduct</a> before contributing. By participating, you agree to abide by its guidelines.

## License

MIT License. See LICENSE for details.

## Acknowledgments

- Inspired by quantum physics and the Interstellar soundtrack.
- Simulations use Three.js and PhET resources.
- Thanks to the open-source community for libraries and educational content.

## Contact

For questions or feedback, contact [202401080028@mitaoe.ac.in] or [shahpuresocial@gmail.com].
