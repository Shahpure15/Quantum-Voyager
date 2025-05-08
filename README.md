# Quantum Project

## Overview
The Quantum Project is an interactive simulation platform designed to visualize and explore quantum mechanics concepts such as entanglement, superposition, and the Young's Double-Slit Experiment (YDSE). The project leverages modern web technologies to provide an engaging and educational experience for users.

## Features
- **Quantum Entanglement Simulation**: Visualize the entanglement of two particles with correlated properties such as spin, momentum, and energy.
- **Superposition Simulation**: Explore the concept of quantum superposition and observe how particles exist in multiple states simultaneously.
- **Young's Double-Slit Experiment (YDSE)**: Simulate the famous experiment to understand wave-particle duality and interference patterns.
- **Dark/Light Mode**: Toggle between dark and light themes for better accessibility and user experience.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Interactive Controls**: Adjust parameters such as spin, energy, and phase to observe their effects in real-time.

## Project Structure
```
Quantum-Project/
├── index.html                # Main entry point
├── package.json              # Project dependencies and scripts
├── README.md                 # Project documentation
├── script.js                 # Main JavaScript logic
├── styles.css                # Global styles
├── assets/                   # Static assets
│   ├── images/               # Image files
│   │   ├── qvlogo.png
│   │   ├── qvlogo.svg
│   │   └── qvlogocolor.png
├── common/                   # Shared utilities and components
│   ├── audio-manager.js      # Audio management logic
│   ├── starfield.js          # Starfield background logic
│   ├── ui-controls.js        # UI control logic
│   └── utils.js              # General utility functions
├── entanglement/             # Quantum entanglement simulation
│   ├── entanglement.html     # Entanglement simulation page
├── superposition/            # Superposition simulation
│   ├── superposition.css     # Styles for superposition
│   ├── superposition.html    # Superposition simulation page
│   └── superposition.js      # Logic for superposition
└── ydse/                     # Young's Double-Slit Experiment simulation
    └── ydse.html             # YDSE simulation page
```

## Getting Started

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge)
- Node.js and npm (for development purposes)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Shahpure15/Quantum-Project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Quantum-Project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project
1. Start a local development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage
- Navigate to different simulation pages (Entanglement, Superposition, YDSE) using the provided links.
- Use the interactive controls to modify parameters and observe changes in real-time.
- Toggle between dark and light modes using the theme switcher.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Inspired by the fascinating world of quantum mechanics.
- Built with love using HTML, CSS, JavaScript, and Three.js.

## Contact
For questions or feedback, please contact [202401080028@mitaoe.ac.in].
