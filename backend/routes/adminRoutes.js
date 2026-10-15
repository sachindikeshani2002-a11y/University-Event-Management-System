const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get("/users", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
  const filter = {};
  if (["student", "organizer", "admin"].includes(req.query.role)) filter.role = req.query.role;
  if (typeof req.query.search === "string" && req.query.search.trim()) {
    const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [{ name: new RegExp(escaped, "i") }, { email: new RegExp(escaped, "i") }];
  }
  const [users, total] = await Promise.all([
    User.find(filter).select("name email role createdAt").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);
  return res.json({ users, page, limit, total });
});

router.patch("/users/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid user ID." });
  const updates = {};
  if (typeof req.body?.name === "string") updates.name = req.body.name.trim();
  if (typeof req.body?.email === "string") updates.email = req.body.email.trim().toLowerCase();
  if (req.body?.role !== undefined) {
    if (!["student", "organizer", "admin"].includes(req.body.role)) return res.status(400).json({ message: "Choose a valid account role." });
    if (req.params.id === req.user.id && req.body.role !== "admin") return res.status(409).json({ message: "You cannot remove your own administrator access." });
    updates.role = req.body.role;
  }
  if (!Object.keys(updates).length || Object.values(updates).some((value) => !value)) return res.status(400).json({ message: "Provide valid account changes." });
  if ((updates.name && updates.name.length > 120) || (updates.email && updates.email.length > 254)) return res.status(400).json({ message: "Name or email address is too long." });
  if (updates.email && !emailPattern.test(updates.email)) return res.status(400).json({ message: "Please provide a valid email address." });
  try {
    if (updates.role && updates.role !== "admin") {
      const target = await User.findById(req.params.id);
      if (!target) return res.status(404).json({ message: "User not found." });
      if (target.role === "admin") return res.status(409).json({ message: "Administrator accounts cannot be demoted through user management." });
    }
    const filter = { _id: req.params.id };
    // Do not let a concurrent role update demote an account after it becomes an administrator.
    if (updates.role && updates.role !== "admin") filter.role = { $ne: "admin" };
    const user = await User.findOneAndUpdate(filter, updates, { new: true, runValidators: true }).select("name email role createdAt");
    if (!user) {
      const current = await User.findById(req.params.id);
      if (current && updates.role && updates.role !== "admin" && current.role === "admin") {
        return res.status(409).json({ message: "Administrator accounts cannot be demoted through user management." });
      }
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ user });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    throw error;
  }
});

module.exports = router;
