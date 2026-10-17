const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const jwt = require("jsonwebtoken");
const Announcement = require("../models/Announcement");
const User = require("../models/User");
const { app } = require("../server");

test("announcement APIs enforce roles, audiences, and creator ownership", async () => {
  const originals = { findById: User.findById, create: Announcement.create, find: Announcement.find, findOneAndUpdate: Announcement.findOneAndUpdate };
  const originalSecret = process.env.JWT_SECRET;
  const secret = "announcement-test-only-secret";
  const organizerId = "64b000000000000000000011";
  const otherOrganizerId = "64b000000000000000000012";
  const studentId = "64b000000000000000000013";
  const created = [];
  process.env.JWT_SECRET = secret;
  User.findById = async (id) => ({ toJSON: () => ({ id, name: "Test User", email: "test@example.edu", role: id === organizerId || id === otherOrganizerId ? "organizer" : "student" }) });
  Announcement.create = async (value) => { const announcement = { ...value, _id: "64b000000000000000000099" }; created.push(announcement); return announcement; };
  Announcement.find = () => ({ sort: async () => created });
  Announcement.findOneAndUpdate = async (filter, updates) => filter.creator === organizerId ? { ...created[0], ...updates } : null;

  const server = app.listen(0);
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = (id) => jwt.sign({}, secret, { subject: id, expiresIn: "1h", algorithm: "HS256" });
  const post = (id, body) => fetch(`${base}/api/announcements`, { method: "POST", headers: { Authorization: `Bearer ${token(id)}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  try {
    const body = { title: "Campus update", message: "A useful update.", date: "2099-07-19", status: "Published", audience: "All Users" };
    assert.equal((await post(studentId, body)).status, 403);
    assert.equal((await post(organizerId, body)).status, 201);
    assert.equal(created[0].creator, organizerId);
    assert.equal(created[0].audience, "Students");
    const denied = await fetch(`${base}/api/announcements/64b000000000000000000099`, { method: "PATCH", headers: { Authorization: `Bearer ${token(otherOrganizerId)}`, "Content-Type": "application/json" }, body: JSON.stringify({ title: "Changed" }) });
    assert.equal(denied.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findById = originals.findById;
    Announcement.create = originals.create;
    Announcement.find = originals.find;
    Announcement.findOneAndUpdate = originals.findOneAndUpdate;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
