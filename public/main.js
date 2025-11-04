// I. Basic canvas setup
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const seedInput = document.getElementById("seedInput");
const applySeedButton = document.getElementById("applySeed");

// Resize canvas so it matches the size of its container
function resizeCanvas() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
}
resizeCanvas();
window.addEventListener("resize", () => { resizeCanvas(); drawStars(); });

// II. Deterministic random number generator based on a text seed
let seedValue = 0;

// Turn a text seed into a number
function setSeed(textSeed)  {
    seedValue = 0;
    for (let i = 0; i < textSeed.length; i++)
        seedValue += textSeed.charCodeAt(i);
    }

// Create a random number between 0 and 1 based on the seed value
function random() {
    const x = Math.sin(seedValue++) * 10000;
    return x - Math.floor(x);
    }

// III. Generate stars
function drawStars() {
    const STAR_COUNT = 200; // Determine how many stars to draw
    ctx.globalAlpha = 1; // Clear and paint background every draw
    ctx.fillStyle = "#060912";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas with a dark background

    for (let i = 0; i < STAR_COUNT; i++) {
        const x = random() * canvas.width; // Random x and y positions across the canvas
        const y = random() * canvas.height;
        const radius = 0.5 + random() * 2; // Random size for each star between 0 and 2 pixels
        const alpha = 0.5 + random() * 0.5; // Random brightness for each star between 0.5 and 1
        
        ctx.beginPath(); // Start a new path for each star
        ctx.globalAlpha = alpha; // Set the transparency for this star
        ctx.fillStyle = "#cfe3ff"; // Set the color for this star
        ctx.arc(x, y, radius, 0, Math.PI *2);
        ctx.fill();
    }
    ctx.globalAlpha = 1; // Reset the transparency back to full for any future drawing
}

// Run the function to draw the stars on the canvas once when the page loads
setSeed("orion");
drawStars();

// IV. Apply seed from user input
applySeedButton.addEventListener("click", () => {
    const newSeed = seedInput.value.trim();
    if (newSeed === "") {
        alert("Please enter a new seed.");
        return;
    }
    
    const ok = /^[a-z0-9]+$/i.test(newSeed);
    if (!ok) {
        alert("Please use only letters or numbers for your seed.");
        return;
    }

    setSeed(newSeed);
    drawStars();
});

// V. Add pan and zoom functionality
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;
let scale = 1;

// Add event listeners for panning
canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        offsetX += dx;
        offsetY += dy;
        startX = e.clientX;
        startY = e.clientY;
        drawSky(); // Redraw the sky with updated offsets
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});
canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});

// Add scroll event listener for zooming
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    if (e.deltaY < 0) {
        scale *= 1 + zoomSpeed; // Zoom in
    } else {
        scale *= 1 - zoomSpeed; // Zoom out
    }
    drawSky(); // Redraw the sky with updated scale
});

function drawSky() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    drawStars(); // Draw stars and consellations
    ctx.restore(); // Restore to default
}