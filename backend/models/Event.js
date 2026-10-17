const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  date: { type: Date, required: true },
  startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  location: { type: String, required: true, trim: true, maxlength: 140 },
  capacity: { type: Number, min: 1, default: null },
  registrationDeadline: { type: Date, required: true },
  status: { type: String, enum: ["Draft", "Pending", "Published", "Rejected", "Completed", "Cancelled"], default: "Pending", index: true },
  rejectionReason: { type: String, trim: true, maxlength: 240, default: "" },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  registrationCount: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

eventSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model("Event", eventSchema);
