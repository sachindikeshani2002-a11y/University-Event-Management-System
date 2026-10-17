const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/student", authenticateToken, authorizeRoles("student"), async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [availableEvents, registrations, announcements] = await Promise.all([
    Event.find({ status: "Published", date: { $gte: today } }).sort({ date: 1 }).limit(5).populate("organizer", "name"),
    Registration.find({ student: req.user.id, status: "Registered" }).populate("event").sort({ createdAt: -1 }),
    Announcement.find({ status: "Published", audience: { $in: ["All Users", "Students"] } }).sort({ date: -1 }).limit(3),
  ]);
  const validRegistrations = registrations.filter((item) => item.event);
  return res.json({
    user: req.user,
    availableEventCount: await Event.countDocuments({ status: "Published", date: { $gte: today } }),
    registrations: validRegistrations,
    registeredEventCount: validRegistrations.length,
    upcomingEvents: availableEvents,
    announcements,
  });
});

router.get("/organizer", authenticateToken, authorizeRoles("organizer"), async (req, res) => {
  const events = await Event.find({ organizer: req.user.id }).sort({ date: 1 });
  const eventIds = events.map((event) => event._id);
  const [registrationCount, statusCounts] = await Promise.all([
    Registration.countDocuments({ event: { $in: eventIds }, status: "Registered" }),
    Event.aggregate([{ $match: { organizer: req.user.id } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);
  return res.json({ totalEvents: events.length, registrationCount, statusCounts, upcomingEvents: events.filter((event) => event.date >= new Date()).slice(0, 5) });
});

router.get("/admin", authenticateToken, authorizeRoles("admin"), async (_req, res) => {
  const [userCount, usersByRole, totalEvents, eventsByStatus, registrations, registrationStatuses] = await Promise.all([
    User.countDocuments(),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Event.countDocuments(),
    Event.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Registration.countDocuments(),
    Registration.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);
  return res.json({ userCount, usersByRole, totalEvents, eventsByStatus, registrations, registrationStatuses });
});

module.exports = router;
