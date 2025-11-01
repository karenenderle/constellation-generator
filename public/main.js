// I. Basic canvas setup
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

// Resize canvas so it matches the size of its container
function resizeCanvas() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
}
resizeCanvas();

// II. Deterministic random number generator based on a text seed
let seedValue = 0;

// Turn a text seed into a number
function setSeed(textSeed)  {
    seedValue = 0;
    for (let i = 0; i < textSeed.length; i++) {
        seedValue += textSeed.charCodeAt(i);
    }
}

// Create a random number between 0 and 1 based on the seed value
function random() {
    const x = Math.sin(seedValue++) * 10000;
    return x - Math.floor(x);
}

// III. Generate stars
setSeed("orion"); // Set the same seed each time so the pattern repeats
const STAR_COUNT = 200; // Determine how many stars to draw

// Fill background with a dark color
ctx.fillStyle = "#060912";
ctx.fillRect(0, 0, canvas.width, canvas.height);

//Draw each star
function drawStars() {
    for (let i = 0; i < STAR_COUNT; i++) {
        const x = random() * canvas.width; // Random x and y positions across the canvas
        const y = random() * canvas.height;
        const radius = random() * 2; // Random size for each star, between 0 and 2 pixels
        const alpha = 0.5 + random() * 0.5; // Random brightness for each star, between 0.5 and 1
        
        ctx.beginPath(); // Start a new path for each star
        ctx.globalAlpha = alpha; // Set the transparency for this star
        ctx.fillStyle = "#cfe3ff"; // Set the color for this star
        ctx.arc(x, y, radius, 0, Math.PI *2);
        ctx.fill();
    }
    ctx.globalAlpha = 1; // Reset the transparency back to full for any future drawing
}

// Run the function to draw the stars on the canvas once when the page loads
drawStars();