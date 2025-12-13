// I. Basic canvas setup
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const seedInput = document.getElementById("seedInput");
const applySeedButton = document.getElementById("applySeed");
const mythTitleEl = document.getElementById("mythTitle");
const mythTextEl = document.getElementById("mythText");

async function loadMythForStar(starId, seed) {
  const res = await fetch(`/api/myth?starId=${starId}&seed=${encodeURIComponent(seed || "orion")}`);
  const data = await res.json();

  mythTitleEl.textContent = data.title; // Update the title
  mythTextEl.textContent = data.story; // Put the story in the body area
}

// Constellation line settings
let stars = [];
let STARFIELD_WIDTH = 0;
let STARFIELD_HEIGHT = 0;

let links = [];
let LINK_MAX_DISTANCE = 140;
let LINK_NEIGHBORS = 2;
let showLines = true;

// Controls for constellation lines
const toggleLinesEl = document.getElementById("toggleLines");
const maxNeighborsEl = document.getElementById("maxNeighbors");
const neighborsOutEl = document.getElementById("neighborsOut");
const maxDistanceEl = document.getElementById("maxDistance");
const distanceOutEl = document.getElementById("distanceOut");

// Initialize line controls
if (toggleLinesEl) {
    showLines = toggleLinesEl.checked;
    toggleLinesEl.addEventListener("change", () => {
        showLines = toggleLinesEl.checked;
        drawSky(); // Redraw with or without lines
    });
}

if (maxNeighborsEl && neighborsOutEl) {
    LINK_NEIGHBORS = Number(maxNeighborsEl.value);
    neighborsOutEl.textContent = LINK_NEIGHBORS;
    
    maxNeighborsEl.addEventListener("input", () => {
        LINK_NEIGHBORS = Number(maxNeighborsEl.value);
        neighborsOutEl.textContent = LINK_NEIGHBORS;
    });
}

if (maxDistanceEl && distanceOutEl) {
    LINK_MAX_DISTANCE = Number(maxDistanceEl.value);
    distanceOutEl.textContent = LINK_MAX_DISTANCE;

    maxDistanceEl.addEventListener("input", () => {
        LINK_MAX_DISTANCE = Number(maxDistanceEl.value);
        distanceOutEl.textContent = LINK_MAX_DISTANCE;
        drawSky(); // Redraw with new distance
    });
}

// Default text to show in myth panel
const DEFAULT_MYTH_TEXT = "Click on a star to learn its myth.";

// If the panel is empty, restore the default text
if (mythTextEl && !mythTextEl.textContent.trim()) {
    mythTextEl.textContent = DEFAULT_MYTH_TEXT;
}

// Resize canvas so it matches the size of its container
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Actual drawn size in CSS pixels
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    // Don't resize if the canvas isn't visible yet
    if (displayWidth === 0 || displayHeight === 0) {
        return;
    }

    // Set internal resolution to match the display size and device pixel ratio
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
}

// Initialize once everything is loaded
function initSky() {
    resizeCanvas(); // Make the canvas match the pill
    drawSky();      // Draw the stars
}

// Resize and redraw on window resize
window.addEventListener("load", initSky);
window.addEventListener("resize", () => {
    resizeCanvas();
    drawSky();
});

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

// III. Generate stars for one "tile" of the starfield
function generateStars() {
    const STAR_COUNT = 200; // Determine how many stars to draw

    // Use the canvas size as the base tile size
    STARFIELD_WIDTH = canvas.width;
    STARFIELD_HEIGHT = canvas.height;

    stars = []; // Clear existing stars

    // Draw each star
    for (let i = 0; i < STAR_COUNT; i++) {
        const x = random() * canvas.width; // Random x and y positions across the canvas
        const y = random() * canvas.height;
        const radius = 0.5 + random() * 2; // Random size for each star between 0 and 2 pixels
        const alpha = 0.5 + random() * 0.5; // Random brightness for each star between 0.5 and 1
        
        stars.push({ // Store star info for click detection
            id: i, // Unique ID for each star
            x: x, // X position
            y: y, // Y position
            radius: radius, // Size of the star
            alpha: alpha // Brightness of the star
        });
    }
}

// Draw constellation lines between stars
function buildConstellationLines() {
    links = []; // Clear existing links

    for (let i = 0; i < stars.length; i++) {
        const starA = stars[i];
        const neighbors = [];

        // Look at every other star
        for (let j = 0; j < stars.length; j++) {
            if (i === j) continue; // Skip itself
            const starB = stars[j];

            // Calculate distance between stars
            const dx = starA.x - starB.x;
            const dy = starA.y - starB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If within max distance, consider as a neighbor
            if (distance <= LINK_MAX_DISTANCE) {
                neighbors.push({ index: j, distance });
            }
        }

        // Sort neighbors by distance and take the closest ones
        neighbors.sort((a, b) => a.distance - b.distance);

        const toConnect = neighbors.slice(0, LINK_NEIGHBORS);
        for (const n of toConnect) {
            const j = n.index;
            // To avoid duplicate lines, only add if i < j
            if (i < j) {
                links.push({ from: i, to: j });
            }
        }
    }
}

// IV. Draw an infinite starfield
function drawStarsInfinite() {
    // if (!stars.length || STARFIELD_WIDTH === 0 || STARFIELD_HEIGHT === 0) return; // No stars to draw yet

    const tileW = STARFIELD_WIDTH;
    const tileH = STARFIELD_HEIGHT;

    // Figure out which part of the "world" is currently visible
    const minX = (-offsetX) / scale; // Left edge in sky coordinates
    const minY = (-offsetY) / scale; // Top edge in sky coordinates
    const maxX = minX + (canvas.width / scale); // Right edge in sky coordinates
    const maxY = minY + (canvas.height / scale); // Bottom edge in sky coordinates

    // Find which tiles intersect the visible area
    const startTileX = Math.floor(minX / tileW) - 1; // Extra buffer tile
    const startTileY = Math.floor(minY / tileH) - 1; // Extra buffer tile
    const endTileX = Math.floor(maxX / tileW) + 1; // Extra buffer tile
    const endTileY = Math.floor(maxY / tileH) + 1; // Extra buffer tile

    // Loop through the visible tiles and draw stars
    for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
            const shiftX = tileX * tileW; // Calculate the offset for this tile
            const shiftY = tileY * tileH; // Calculate the offset for this tile

            // Draw all stars in this tile
            for (const star of stars) {
                ctx.beginPath(); // Start a new path for each star
                ctx.globalAlpha = star.alpha; // Set the transparency for this star
                ctx.fillStyle = "#cfe3ff"; // Set the color for this star
                ctx.arc(star.x + shiftX, star.y + shiftY, star.radius, 0, Math.PI *2); // Draw a circle for the star
                ctx.fill(); // Fill the star shape
            }
        }
    }

    ctx.globalAlpha = 1; // Reset the transparency back to full for any future drawing
}

function drawConstellationLinesInfinite() {
    if (links.length === 0 || STARFIELD_WIDTH === 0 || STARFIELD_HEIGHT === 0) return; // No links to draw

    const tileW = STARFIELD_WIDTH;;
    const tileH = STARFIELD_HEIGHT;

    // Figure out which part of the "world" is currently visible (same logic as stars)
    const minX = (-offsetX) / scale; // Left edge in sky coordinates
    const minY = (-offsetY) / scale; // Top edge in sky coordinates
    const maxX = minX + (canvas.width / scale); // Right edge in sky coordinates
    const maxY = minY + (canvas.height / scale); // Bottom edge in sky coordinates

    const startTileX = Math.floor(minX / tileW) - 1;
    const startTileY = Math.floor(minY / tileH) - 1;
    const endTileX   = Math.floor(maxX / tileW) + 1;
    const endTileY   = Math.floor(maxY / tileH) + 1;

    ctx.save();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(148, 197, 253, 0.9)"; // Soft blue color for constellation lines
    ctx.globalAlpha = 0.9;

    for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
            const shiftX = tileX * tileW; // Calculate the offset for this tile
            const shiftY = tileY * tileH; // Calculate the offset for this tile

            // Draw all links in this tile
            for (const link of links) {
                const starA = stars[link.from]; // Get the two stars to connect
                const starB = stars[link.to];

                ctx.beginPath();
                ctx.moveTo(starA.x + shiftX, starA.y + shiftY); // Move to the first star
                ctx.lineTo(starB.x + shiftX, starB.y + shiftY); // Draw a line to the second star
                ctx.stroke(); // Stroke the line
            }
        }
    }

    ctx.restore(); // Restore to default
    ctx.globalAlpha = 1; // Reset the transparency back to full for any future drawing
}

// V. Apply seed from user input
applySeedButton.addEventListener("click", () => {
    const newSeed = seedInput.value.trim(); // Get the seed value from the input field
    if (newSeed === "") {
        alert("Please enter a new seed.");
        return;
    }
    
    const ok = /^[a-z0-9]+$/i.test(newSeed); // Validate seed input
    if (!ok) {
        alert("Please use only letters or numbers for your seed.");
        return;
    }

    // Seed will be used inside drawSky() to ensure stars match the seed every time
    drawSky(); // Redraw the sky with the new seed
    if (mythTextEl) {
        mythTextEl.textContent = DEFAULT_MYTH_TEXT; // Clear any existing myth text
    }
});

// VI. Add pan and zoom functionality
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

// Add event listener for mouse movement
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

// Stop dragging on mouse up or leave
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
        if (scale < 0.1) scale = 0.1; // Prevent zooming out too far
    }
    drawSky(); // Redraw the sky with updated scale
});

// VII.Redraw the entire sky with panning and zooming
function drawSky() {
    ctx.save();

    // Clear the canvas and paint the background once
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#060912"; // Dark night sky color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply pan and zoom transformations
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Reset seed before drawing so stars match the seed every time
    const currentSeed = (seedInput.value && seedInput.value.trim()) || "orion";
    setSeed(currentSeed);

    generateStars();           // Make stars for this seed
    buildConstellationLines(); // Decide which stars are connected

    if (showLines) {
        drawConstellationLinesInfinite(); // Draw constellation lines first
    }
    
    drawStarsInfinite();       // Draw stars on top of the lines

    ctx.restore();             // Restore to default
}

// VIII. Fetch and display constellation myth
// Ask backend for a story for a specific star (by id)
async function fetchMythForName(seed, starId) {
    if (mythTextEl) {
        mythTextEl.textContent = "Loading myth...";
    }

    try {
        const url = `/api/myth?seed=${encodeURIComponent(seed)}&starId=${encodeURIComponent(starId)}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data || !data.story || !data.title) {
            throw new Error("No myth found");
        }

        if (mythTitleEl) {
            mythTitleEl.textContent = data.title;
        }

        if (mythTextEl) {
            mythTextEl.textContent = data.story;
        }
    } catch (error) {
        console.error(error);
        if (mythTextEl) {
            mythTextEl.textContent = "Sorry, we couldn't retrieve a myth for that star.";
        }
    }
}

// IX. Click-to-fetch-myth functionality
// Convert from screen coordinates to canvas coordinates to sky coordinates
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Position relative to the canvas element
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    // Adjust for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const pixelX = canvasX * dpr;
    const pixelY = canvasY * dpr;

    // Undo pan and zoom to get the coordinates in starfield
    const skyX = (pixelX - offsetX * dpr) / scale;
    const skyY = (pixelY - offsetY * dpr) / scale;

    // Wrap into the base tile so clicks work on any repeated tile
    const tileW = STARFIELD_WIDTH || canvas.width;
    const tileH = STARFIELD_HEIGHT || canvas.height;
    let wrappedX = skyX;
    let wrappedY = skyY;

    if (tileW > 0 && tileH > 0) { // Avoid division by zero
        wrappedX = ((skyX % tileW) + tileW) % tileW; // Wrap X coordinate
        wrappedY = ((skyY % tileH) + tileH) % tileH; // Wrap Y coordinate
    }

    // Find a star close to the click (in the base tile)
    const CLICK_RADIUS = 5; // How close in pixels the click must be
    let clickedStar = null;

    for (const star of stars) {
        const dx = star.x - wrappedX;
        const dy = star.y - wrappedY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= CLICK_RADIUS) {
            clickedStar = star;
            break;
        }
    }

    // If a star was clicked, fetch its myth
    if (!clickedStar) return; // Only proceed if a star was clicked
        const currentSeed = (seedInput.value && seedInput.value.trim()) || "orion";
        fetchMythForName(currentSeed, String(clickedStar.id));
});

// // X. Initial draw
// drawSky();