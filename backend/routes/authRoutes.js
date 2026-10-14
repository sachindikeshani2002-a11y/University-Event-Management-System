const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!name || !email || !password.trim()) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (name.length > 120 || email.length > 254) {
    return res.status(400).json({ message: "Name or email address is too long." });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({ message: "Password must not exceed 72 bytes." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  try {
    const user = await User.create({ name, email, password, role: "student" });
    return res.status(201).json({ user: user.toJSON() });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    throw error;
  }
});

router.post("/login", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      message: "Authentication is not configured on the server.",
    });
  }

  const token = jwt.sign({}, secret, {
    subject: user._id.toString(),
    expiresIn: "1d",
    algorithm: "HS256",
  });

  return res.json({ token, user: user.toJSON() });
});

router.get("/me", authenticateToken, (req, res) => {
  return res.json({ user: req.user });
});

router.patch("/me", authenticateToken, async (req, res) => {
  const updates = {};
  if (typeof req.body?.name === "string") updates.name = req.body.name.trim();
  if (typeof req.body?.email === "string") updates.email = req.body.email.trim().toLowerCase();
  if (Object.keys(updates).length === 0 || Object.values(updates).some((value) => !value)) {
    return res.status(400).json({ message: "Provide a valid name or email to update." });
  }
  if ((updates.name && updates.name.length > 120) || (updates.email && updates.email.length > 254)) return res.status(400).json({ message: "Name or email address is too long." });
  if (updates.email && !emailPattern.test(updates.email)) return res.status(400).json({ message: "Please provide a valid email address." });
  try {
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "Account not found." });
    return res.json({ user: user.toJSON() });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    throw error;
  }
});

module.exports = router;
