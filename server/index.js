require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Character = require("./models/Character");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5051;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rick_morty";
const JWT_SECRET = process.env.JWT_SECRET || "rm-local-jwt-secret";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, path.join(__dirname, "uploads")),
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname || "") || ".png";
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    return cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_, res) => {
  res.json({ ok: true, service: "rick-and-morty-server" });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, password: hash });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(201).json({ token, user: { email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token, user: { email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/characters/submissions", auth, async (req, res) => {
  const characters = await Character.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
  res.json(characters);
});

app.post("/api/characters/submissions", auth, upload.single("image"), async (req, res) => {
  try {
    const character = await Character.create({
      name: req.body.name,
      status: req.body.status,
      species: req.body.species,
      gender: req.body.gender,
      origin: req.body.origin,
      location: req.body.location,
      contactEmail: req.body.email,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      ownerId: req.user.userId,
    });
    return res.status(201).json(character);
  } catch (error) {
    return res.status(400).json({ message: "Invalid character payload" });
  }
});

app.delete("/api/characters/submissions/:id", auth, async (req, res) => {
  const deleted = await Character.findOneAndDelete({
    _id: req.params.id,
    ownerId: req.user.userId,
  });
  if (!deleted) return res.status(404).json({ message: "Submission not found" });
  return res.json({ ok: true });
});

app.get("/api/characters/search", async (req, res) => {
  const name = String(req.query.name || "").trim();
  const page = String(req.query.page || "1");
  if (!name) return res.status(400).json({ message: "Query name is required" });

  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}&page=${encodeURIComponent(page)}`
    );
    if (!response.ok) {
      return res.status(response.status).json({ message: "Search upstream failed" });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ message: "Failed to fetch Rick and Morty API" });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Rick and Morty server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });
