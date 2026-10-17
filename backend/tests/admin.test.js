const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { app } = require("../server");

test("admin APIs enforce roles and preserve administrator access", async () => {
  const originals = { findById: User.findById, findOneAndUpdate: User.findOneAndUpdate };
  const originalSecret = process.env.JWT_SECRET;
  const secret = "admin-route-test-secret";
  const adminId = "64b000000000000000000031";
  const studentId = "64b000000000000000000032";
  const organizerId = "64b000000000000000000033";
  const records = new Map([
    [adminId, { _id: adminId, name: "Admin", email: "admin@example.edu", role: "admin", password: "private-hash" }],
    [studentId, { _id: studentId, name: "Student", email: "student@example.edu", role: "student", password: "private-hash" }],
    [organizerId, { _id: organizerId, name: "Organizer", email: "organizer@example.edu", role: "organizer", password: "private-hash" }],
  ]);
  const safeUser = (record) => ({ _id: record._id, id: record._id, name: record.name, email: record.email, role: record.role, createdAt: new Date("2026-01-01") });

  process.env.JWT_SECRET = secret;
  User.findById = async (id) => {
    const record = records.get(String(id));
    return record && { ...record, toJSON: () => ({ id: record._id, name: record.name, email: record.email, role: record.role }) };
  };
  User.findOneAndUpdate = (filter, updates) => ({
    select: async () => {
      const record = records.get(String(filter._id));
      if (!record || (filter.role?.$ne === "admin" && record.role === "admin")) return null;
      Object.assign(record, updates);
      return safeUser(record);
    },
  });

  const server = app.listen(0);
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = (id) => jwt.sign({}, secret, { subject: id, expiresIn: "1h", algorithm: "HS256" });
  const request = (path, id, body) => fetch(`${base}${path}`, {
    method: body ? "PATCH" : "GET",
    headers: { ...(id ? { Authorization: `Bearer ${token(id)}` } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  try {
    assert.equal((await request("/api/admin/users", null)).status, 401);
    assert.equal((await request("/api/admin/users", studentId)).status, 403);
    assert.equal((await request("/api/admin/users", organizerId)).status, 403);
    assert.equal((await request(`/api/admin/users/${studentId}`, studentId, { role: "admin" })).status, 403);

    const changed = await request(`/api/admin/users/${studentId}`, adminId, { role: "organizer", id: adminId, password: "ignored" });
    assert.equal(changed.status, 200);
    const changedBody = await changed.json();
    assert.equal(changedBody.user.role, "organizer");
    assert.equal(changedBody.user.id, studentId);
    assert.equal(Object.hasOwn(changedBody.user, "password"), false);
    assert.equal(records.get(studentId).role, "organizer");

    const demoteAnotherAdmin = await request(`/api/admin/users/${adminId}`, organizerId, { role: "organizer" });
    assert.equal(demoteAnotherAdmin.status, 403);
    const demoteAdmin = await request(`/api/admin/users/${adminId}`, adminId, { role: "organizer" });
    assert.equal(demoteAdmin.status, 409);
    assert.equal(records.get(adminId).role, "admin");
    assert.equal((await request(`/api/admin/users/${organizerId}`, adminId, { role: "root" })).status, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findById = originals.findById;
    User.findOneAndUpdate = originals.findOneAndUpdate;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
