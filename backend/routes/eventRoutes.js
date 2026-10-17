const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();
const isId = (value) => mongoose.isValidObjectId(value);
const fields = ["title", "description", "category", "date", "startTime", "endTime", "location", "capacity", "registrationDeadline"];

function validateEvent(body) {
  const values = {};
  for (const field of fields) values[field] = body?.[field];
  values.title = typeof values.title === "string" ? values.title.trim() : "";
  values.description = typeof values.description === "string" ? values.description.trim() : "";
  values.category = typeof values.category === "string" ? values.category.trim() : "";
  values.location = typeof values.location === "string" ? values.location.trim() : "";
  const date = new Date(values.date);
  const deadline = new Date(values.registrationDeadline || values.date);
  const capacity = values.capacity === "" || values.capacity == null ? null : Number(values.capacity);
  if (!values.title || !values.description || !values.category || !values.location || !values.startTime || !values.endTime || Number.isNaN(date.getTime()) || Number.isNaN(deadline.getTime())) return { error: "Complete all required event fields with valid dates." };
  if (values.title.length > 120 || values.description.length > 2000 || values.category.length > 60 || values.location.length > 140) return { error: "One or more event fields exceed the allowed length." };
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.endTime) || values.endTime <= values.startTime) return { error: "Enter a valid event time range." };
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) return { error: "Capacity must be a positive whole number." };
  if (deadline > date) return { error: "Registration deadline cannot be after the event date." };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(date);
  eventDay.setHours(0, 0, 0, 0);
  if (eventDay < today) return { error: "Event date must be today or later." };
  values.date = date;
  values.registrationDeadline = deadline;
  values.capacity = capacity;
  return { values };
}

router.get("/", async (_req, res) => {
  const events = await Event.find({ status: "Published", date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } })
    .populate("organizer", "name")
    .sort({ date: 1 });
  const counts = await Registration.aggregate([
    { $match: { status: "Registered", event: { $in: events.map((event) => event._id) } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
  return res.json({ events: events.map((event) => ({ ...event.toJSON(), registrationCount: countMap.get(String(event._id)) || 0 })) });
});

router.get("/mine", authenticateToken, authorizeRoles("organizer"), async (req, res) => {
  const events = await Event.find({ organizer: req.user.id }).sort({ date: 1 });
  const counts = await Registration.aggregate([
    { $match: { status: "Registered", event: { $in: events.map((event) => event._id) } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
  return res.json({ events: events.map((event) => ({ ...event.toJSON(), registrationCount: countMap.get(String(event._id)) || 0 })) });
});

router.get("/admin", authenticateToken, authorizeRoles("admin"), async (_req, res) => {
  const events = await Event.find().populate("organizer", "name email").sort({ createdAt: -1 });
  return res.json({ events });
});

router.post("/", authenticateToken, authorizeRoles("organizer"), async (req, res) => {
  const { values, error } = validateEvent(req.body || {});
  if (error) return res.status(400).json({ message: error });
  const status = req.body.status === "Draft" ? "Draft" : "Pending";
  const event = await Event.create({ ...values, status, organizer: req.user.id });
  return res.status(201).json({ event });
});

router.patch("/:id/cancel", authenticateToken, authorizeRoles("organizer"), async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
  if (!event) return res.status(404).json({ message: "Event not found." });
  if (event.status === "Completed") return res.status(409).json({ message: "Completed events cannot be cancelled." });
  event.status = "Cancelled";
  await event.save();
  await Registration.updateMany({ event: event._id, status: "Registered" }, { status: "Cancelled" });
  await Event.updateOne({ _id: event._id }, { registrationCount: 0 });
  return res.json({ event });
});

router.get("/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  const event = await Event.findOne({ _id: req.params.id, status: "Published" }).populate("organizer", "name");
  if (!event) return res.status(404).json({ message: "Event not found." });
  return res.json({ event });
});

router.patch("/:id", authenticateToken, authorizeRoles("organizer"), async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
  if (!event) return res.status(404).json({ message: "Event not found." });
  if (["Cancelled", "Completed"].includes(event.status)) return res.status(409).json({ message: "This event can no longer be edited." });
  const { values, error } = validateEvent(req.body || {});
  if (error) return res.status(400).json({ message: error });
  if (values.capacity != null && values.capacity < event.registrationCount) return res.status(409).json({ message: "Capacity cannot be lower than the current registration count." });
  Object.assign(event, values, { status: req.body.status === "Draft" ? "Draft" : "Pending" });
  await event.save();
  return res.json({ event });
});

router.patch("/:id/moderation", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  if (!["Published", "Rejected", "Cancelled"].includes(req.body?.status)) return res.status(400).json({ message: "Choose a valid moderation status." });
  const updates = { status: req.body.status };
  if (req.body.status === "Rejected") updates.rejectionReason = typeof req.body.reason === "string" ? req.body.reason.trim().slice(0, 240) : "";
  const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!event) return res.status(404).json({ message: "Event not found." });
  if (req.body.status === "Cancelled") {
    await Registration.updateMany({ event: event._id, status: "Registered" }, { status: "Cancelled" });
    await Event.updateOne({ _id: event._id }, { registrationCount: 0 });
  }
  return res.json({ event });
});

router.get("/:id/registrations", authenticateToken, authorizeRoles("organizer", "admin"), async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found." });
  if (req.user.role === "organizer" && String(event.organizer) !== req.user.id) return res.status(403).json({ message: "You do not have permission to view these registrations." });
  const registrations = await Registration.find({ event: event._id }).populate("student", "name email").sort({ createdAt: -1 });
  return res.json({ registrations });
});

module.exports = router;
