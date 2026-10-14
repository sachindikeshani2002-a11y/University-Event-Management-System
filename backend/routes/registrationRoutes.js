const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
  const [registrations, total] = await Promise.all([
    Registration.find().populate("student", "name email").populate({ path: "event", select: "title category organizer", populate: { path: "organizer", select: "name" } }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Registration.countDocuments(),
  ]);
  return res.json({ registrations, page, limit, total });
});

router.get("/organizer", authenticateToken, authorizeRoles("organizer"), async (req, res) => {
  const ownedEvents = await Event.find({ organizer: req.user.id }).select("_id");
  const registrations = await Registration.find({ event: { $in: ownedEvents.map((event) => event._id) } })
    .populate("student", "name email")
    .populate("event", "title")
    .sort({ createdAt: -1 });
  return res.json({ registrations });
});

router.post("/:eventId", authenticateToken, authorizeRoles("student"), async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.isValidObjectId(eventId)) return res.status(400).json({ message: "Invalid event ID." });
  const event = await Event.findById(eventId);
  if (!event || event.status !== "Published") return res.status(404).json({ message: "This event is not available for registration." });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(event.date);
  eventDay.setHours(0, 0, 0, 0);
  const deadlineDay = new Date(event.registrationDeadline);
  deadlineDay.setHours(0, 0, 0, 0);
  if (eventDay < today || deadlineDay < today) return res.status(409).json({ message: "Registration for this event is closed." });
  const existing = await Registration.findOne({ student: req.user.id, event: event._id });
  if (existing && existing.status !== "Cancelled") return res.status(409).json({ message: "You are already registered for this event." });

  const capacityFilter = event.capacity == null ? { _id: event._id, status: "Published" } : { _id: event._id, status: "Published", registrationCount: { $lt: event.capacity } };
  const reserved = await Event.findOneAndUpdate(capacityFilter, { $inc: { registrationCount: 1 } }, { new: true });
  if (!reserved) {
    const latest = await Event.findById(eventId);
    return res.status(409).json({ message: latest?.status === "Published" ? "This event is full." : "This event is no longer available for registration." });
  }
  try {
    const restored = await Registration.findOneAndUpdate(
      { student: req.user.id, event: event._id, status: "Cancelled" },
      { status: "Registered" },
      { new: true }
    );
    if (restored) return res.status(201).json({ registration: restored });
    const registration = await Registration.create({ student: req.user.id, event: event._id });
    const currentEvent = await Event.findById(eventId);
    if (!currentEvent || currentEvent.status !== "Published") {
      await Registration.updateOne({ _id: registration._id }, { status: "Cancelled" });
      await Event.updateOne({ _id: event._id, registrationCount: { $gt: 0 } }, { $inc: { registrationCount: -1 } });
      return res.status(409).json({ message: "This event is no longer available for registration." });
    }
    return res.status(201).json({ registration });
  } catch (error) {
    await Event.updateOne({ _id: event._id }, { $inc: { registrationCount: -1 } });
    if (error.code === 11000) return res.status(409).json({ message: "You are already registered for this event." });
    throw error;
  }
});

router.get("/mine", authenticateToken, authorizeRoles("student"), async (req, res) => {
  const registrations = await Registration.find({ student: req.user.id, status: "Registered" })
    .populate("event")
    .sort({ createdAt: -1 });
  return res.json({ registrations: registrations.filter((item) => item.event) });
});

router.delete("/:registrationId", authenticateToken, authorizeRoles("student"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.registrationId)) return res.status(400).json({ message: "Invalid registration ID." });
  const registration = await Registration.findOneAndUpdate(
    { _id: req.params.registrationId, student: req.user.id, status: "Registered" },
    { status: "Cancelled" },
    { new: true }
  );
  if (!registration) return res.status(404).json({ message: "Registration not found." });
  const event = await Event.findById(registration.event);
  if (event && event.date <= new Date()) {
    await Registration.updateOne({ _id: registration._id }, { status: "Registered" });
    return res.status(409).json({ message: "Past event registrations cannot be cancelled." });
  }
  await Event.updateOne({ _id: registration.event, registrationCount: { $gt: 0 } }, { $inc: { registrationCount: -1 } });
  return res.json({ registration });
});

module.exports = router;
