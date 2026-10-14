const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  audience: { type: String, enum: ["All Users", "Students", "Organizers"], default: "All Users" },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Draft", "Published"], default: "Draft", index: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, { timestamps: true });

announcementSchema.index({ status: 1, audience: 1, date: -1 });

module.exports = mongoose.model("Announcement", announcementSchema);
