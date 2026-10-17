const express = require("express");
const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();
const audiences = ["All Users", "Students", "Organizers"];
const statuses = ["Draft", "Published"];

router.get("/", authenticateToken, async (req, res) => {
  let filter;
  if (req.user.role === "admin") filter = {};
  else if (req.user.role === "organizer") filter = { creator: req.user.id };
  else filter = { status: "Published", audience: { $in: ["All Users", "Students"] } };
  const announcements = await Announcement.find(filter).sort({ date: -1, createdAt: -1 });
  return res.json({ announcements });
});

router.post("/", authenticateToken, authorizeRoles("admin", "organizer"), async (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const date = new Date(req.body?.date);
  const status = statuses.includes(req.body?.status) ? req.body.status : "Draft";
  const audience = req.user.role === "organizer" ? "Students" : (audiences.includes(req.body?.audience) ? req.body.audience : "All Users");
  if (!title || !message || Number.isNaN(date.getTime())) return res.status(400).json({ message: "Enter a title, message, and valid date." });
  if (title.length > 120 || message.length > 1000) return res.status(400).json({ message: "Announcement fields exceed the allowed length." });
  const announcement = await Announcement.create({ title, message, date, status, audience, creator: req.user.id });
  return res.status(201).json({ announcement });
});

router.patch("/:id", authenticateToken, authorizeRoles("admin", "organizer"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid announcement ID." });
  const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, creator: req.user.id };
  const updates = {};
  if (typeof req.body?.title === "string") updates.title = req.body.title.trim();
  if (typeof req.body?.message === "string") updates.message = req.body.message.trim();
  if (req.body?.date !== undefined) updates.date = new Date(req.body.date);
  if (req.user.role === "admin" && req.body?.audience !== undefined) updates.audience = req.body.audience;
  if (req.body?.status !== undefined) updates.status = req.body.status;
  if (!Object.keys(updates).length || Object.values(updates).some((value) => !value) || (updates.date && Number.isNaN(updates.date.getTime())) || (updates.status && !statuses.includes(updates.status)) || (updates.audience && !audiences.includes(updates.audience))) return res.status(400).json({ message: "Provide valid announcement changes." });
  if (req.user.role === "organizer") updates.audience = "Students";
  const announcement = await Announcement.findOneAndUpdate(filter, updates, { new: true, runValidators: true });
  if (!announcement) return res.status(404).json({ message: "Announcement not found." });
  return res.json({ announcement });
});

router.delete("/:id", authenticateToken, authorizeRoles("admin", "organizer"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid announcement ID." });
  const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, creator: req.user.id };
  const announcement = await Announcement.findOneAndDelete(filter);
  if (!announcement) return res.status(404).json({ message: "Announcement not found." });
  return res.json({ message: "Announcement deleted." });
});

module.exports = router;
