# Constellation Generator 🌌

This app allows users to generate constellations procedurally in a starfield and click stars to uncover unique myths. It also uses seeded randomness to generate repeatable starfields.

## Live Demo
**Live site:** https://constellation-generator.onrender.com  
**Repository:** https://github.com/karenenderle/constellation-generator.git

## Features
- **Seeded generation:** Enter a seed to generate a repeatable constellation layout
- **Canvas starfield:** Stars rendered using HTML5 Canvas
- **Constellation lines:** Toggle and customize line connections between stars
- **Clickable stars:** Click a star to generate a unique myth
- **Myth API:** Myths generated via a Node/Express backend endpoint

## Tech Stack
**Front End**
- HTML, CSS, JavaScript
- Canvas 2D API

**Back End**
- Node.js
- Express
- Seeded (deterministic) random number generation
- Deployed on Render

## Deployment (Render)
This project is deployed as a **Node web service** on Render.

- The Express server serves both:
  - Static frontend files
  - API routes (e.g. `/api/myth`)

## Running Locally

### 1) Clone the repository
`git clone https://github.com/karenenderle/constellation-generator.git`  
### 2) Navigate to the project directory
`cd <constellation-generator>`
### 3) Install dependencies
`npm install`
### 4) Run the app
`npm start`
### 5) Access your browser and navigate to:
`http://localhost:8080`
### How to Use
1. Open the app in your browser.
2. Type a seed (ex: `orion`, `andromeda`, `john123`) and click **Apply**.
3. Pan/zoom and explore the starfield.
4. Toggle constellation lines and adjust settings.
5. Click a star to generate a myth for that star.

## Capstone Requirements Fulfilled
This project focuses on procedural generation, deterministic logic, interactive visualization, and full-stack JavaScript fundamentals using Node.js and Express.
| Requirement                                                | Implementation in Constellation Generator                                                                                                                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Analyze data that is stored in arrays, objects, sets, or maps and display information about it in your app.** | Star data (positions, IDs, and connections) is stored in arrays and objects. Constellation generation analyzes proximity and neighbor counts and displays the results visually in the canvas starfield. |
| **Use a regular expression to validate user input and either prevent the invalid input or inform the user about it.**         | Seed input is validated using a regular expression. Invalid characters are rejected and not stored or applied, and the user is informed when input is invalid.                                          |
| **Create a function that accepts two or more input parameters and returns a value that is calculated or determined by the inputs.**      | Procedural generation functions accept multiple parameters (seed, star count, distance thresholds, neighbor limits) to determine star placement, constellation connections, and myth selection.         |
| **Persist important data to the user to local storage and make the stored data accessible in your app.**                       | User preferences such as the current seed and visualization settings are saved to `localStorage` and persist after page reload or refresh.                                                              |
| **Create a Node.js web server using Express.js**           | A Node.js + Express server serves static frontend files and API routes. The app is deployed as a live service on Render.                                                                                |
| **Create an API with GET and POST requests**               | A REST API endpoint (`GET /api/myth`) returns myth data based on star ID and seed.                                                                        |