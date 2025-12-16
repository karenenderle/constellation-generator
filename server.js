// I. Load dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express(); // Create an Express application

app.use(express.json()); // Let Express understand JSON in request bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder

// II. Pick one random item from an array
function pickRandom(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}

// III. Build a myth for a star
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function buildMyth(starId) {
  const epithets = [
    "the Wanderer",
    "Storm-Bringer",
    "Shadow-Keeper",
    "Seafarer",
    "Hearth-Tender",
    "Sky-Weaver",
    "River-Guardian",
  ];

  const figures = [
    "a hunter",
    "a queen",
    "a trickster",
    "a ferryman",
    "a healer",
    "a poet",
    "a builder",
  ];

  const realms = [
    "the northern pines",
    "the endless sea",
    "the ancient mountains",
    "the whispering dunes",
    "the hidden valleys",
    "the celestial plains",
    "the forgotten isles",
  ];

  const omens = [
    "comets",
    "ravens",
    "tides",
    "shadows",
    "winds",
    "fires",
    "echoes",
  ];

  const trials = [
    "a long winter",
    "a great flood",
    "a fierce battle",
    "a perilous journey",
    "a cunning riddle",
    "a vanished city",
    "a sleepless moon",
  ]

  const gifts = [
    "a bronze compass",
    "a silver harp",
    "a golden crown",
    "a map of stars",
    "a woven tapestry",
    "a carved staff",
  ];

const firstNames = [
    "Althea",
    "Callias",
    "Eleni",
    "Thalos",
    "Nikos",
    "Ione",
    "Myrrine",
    "Phaedra",
    "Orpheon",
    "Altheon",
    "Selas",
    "Timon",
    "Lyris",
    "Ephyra",
    "Koros",
    "Melina",
    "Lykos"
];

const secondNames = [
  "of the North Wind",
  "of the Sun",
  "of the Moon",
  "of the Sea",
  "of Thunder",
  "of Shadows",
  "of Dawn",
  "of the Forge",
  "of the Underworld",
  "of the Cross",
  "of Fire",
  "of the Serpent",
  "of Twilight",
  "of the Swan"
];

const numbers = [
  "three",
  "four",
  "five",
  "seven",
  "nine"
];

const starDescriptors = [
  "faint",
  "dim",
  "pale",
  "wandering",
  "sleeping"
];

const vows = [
  "swore",
  "vowed",
  "promised",
  "pledged",
];

const seasonalReturns = [
  "first thaw",
  "last frost",
  "new moon",
  "harvest time",
  "turn of the year"
];

const professions = [
  "Sailors",
  "Fishermen",
  "Shepherds",
  "Merchants",
  "Pilgrims",
  "Hunters"
];

const actions = [
  "bow their heads",
  "raise a lantern",
  "whistle a tune",
  "make an offering",
  "keep the oven door ajar"
];

const starNames = [
  "this star",
  "its beacon",
  "the guiding light",
  "the wanderer's flame",
  "the watchful eye"
];

const starName = `${pickRandom(firstNames)} ${pickRandom(secondNames)}`; // Generate a star name
const title = `${starName}, ${pickRandom(epithets)}`; // Generate a myth title

const story = [
  `${starName} was ${pickRandom(figures)} of ${pickRandom(realms)}.`,
  `When ${pickRandom(omens)} foretold ${pickRandom(trials)}, they set out with ${pickRandom(gifts)}.`,
  `They traced a path by ${pickRandom(numbers)} ${pickRandom(starDescriptors)} stars and ${pickRandom(vows)} to return before the ${pickRandom(seasonalReturns)}.`,
  `${pickRandom(professions)} still ${pickRandom(actions)} when ${pickRandom(starNames)} rises.`
].join(" ");

return {
  id: String(starId),
  title,  // plain text
  story   // plain text
};
}

// IV. API endpoint
app.get("/api/myth", (req, res) => {
  const seedFromQuery = req.query.seed || "orion";
  const starIdFromQuery = req.query.starId;

  if (!starIdFromQuery) {
    return res.status(400).json({ error: "Missing star id" });
  }

  try {
    const myth = buildMyth(String(starIdFromQuery));
    res.json(myth);
  } catch (error) {
    console.error("Error while building myth:", error);
    res.status(500).json({ error: "Myth generation failed" });
  }
});

// Deployment additions
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// V. Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`\nConstellation server running on http://localhost:${PORT}`);
  console.log("Click a star in your frontend to fetch a random myth from /api/myth.");
})