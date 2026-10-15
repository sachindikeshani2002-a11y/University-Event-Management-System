const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { app } = require("../server");

test("admin dashboard statistics come from role-authorized data queries", async () => {
  const originals = {
    userFindById: User.findById,
    userCountDocuments: User.countDocuments,
    userAggregate: User.aggregate,
    eventCountDocuments: Event.countDocuments,
    eventAggregate: Event.aggregate,
    registrationCountDocuments: Registration.countDocuments,
    registrationAggregate: Registration.aggregate,
  };
  const originalSecret = process.env.JWT_SECRET;
  const secret = "dashboard-test-secret";
  const adminId = "64b000000000000000000041";
  process.env.JWT_SECRET = secret;
  User.findById = async (id) => ({ toJSON: () => ({ id, name: "Admin", email: "admin@example.edu", role: id === adminId ? "admin" : "student" }) });
  User.countDocuments = async () => 4;
  User.aggregate = async () => [{ _id: "student", count: 2 }, { _id: "organizer", count: 1 }, { _id: "admin", count: 1 }];
  Event.countDocuments = async () => 3;
  Event.aggregate = async () => [{ _id: "Pending", count: 1 }, { _id: "Published", count: 2 }];
  Registration.countDocuments = async () => 5;
  Registration.aggregate = async () => [{ _id: "Registered", count: 4 }, { _id: "Attended", count: 1 }];

  const server = app.listen(0);
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = jwt.sign({}, secret, { subject: adminId, expiresIn: "1h", algorithm: "HS256" });
  try {
    const response = await fetch(`${base}/api/dashboard/admin`, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      userCount: 4,
      usersByRole: [{ _id: "student", count: 2 }, { _id: "organizer", count: 1 }, { _id: "admin", count: 1 }],
      totalEvents: 3,
      eventsByStatus: [{ _id: "Pending", count: 1 }, { _id: "Published", count: 2 }],
      registrations: 5,
      registrationStatuses: [{ _id: "Registered", count: 4 }, { _id: "Attended", count: 1 }],
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findById = originals.userFindById;
    User.countDocuments = originals.userCountDocuments;
    User.aggregate = originals.userAggregate;
    Event.countDocuments = originals.eventCountDocuments;
    Event.aggregate = originals.eventAggregate;
    Registration.countDocuments = originals.registrationCountDocuments;
    Registration.aggregate = originals.registrationAggregate;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});

test("empty admin dashboard data remains empty and requires an admin", async () => {
  const originals = {
    userFindById: User.findById,
    userCountDocuments: User.countDocuments,
    userAggregate: User.aggregate,
    eventCountDocuments: Event.countDocuments,
    eventAggregate: Event.aggregate,
    registrationCountDocuments: Registration.countDocuments,
    registrationAggregate: Registration.aggregate,
  };
  const originalSecret = process.env.JWT_SECRET;
  const secret = "empty-dashboard-test-secret";
  const studentId = "64b000000000000000000042";
  const adminId = "64b000000000000000000043";
  process.env.JWT_SECRET = secret;
  User.findById = async (id) => ({ toJSON: () => ({ id, name: "User", email: "user@example.edu", role: id === adminId ? "admin" : "student" }) });
  User.countDocuments = async () => 0;
  User.aggregate = async () => [];
  Event.countDocuments = async () => 0;
  Event.aggregate = async () => [];
  Registration.countDocuments = async () => 0;
  Registration.aggregate = async () => [];

  const server = app.listen(0);
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = jwt.sign({}, secret, { subject: studentId, expiresIn: "1h", algorithm: "HS256" });
  const adminToken = jwt.sign({}, secret, { subject: adminId, expiresIn: "1h", algorithm: "HS256" });
  try {
    const empty = await fetch(`${base}/api/dashboard/admin`, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert.equal(empty.status, 200);
    assert.deepEqual(await empty.json(), { userCount: 0, usersByRole: [], totalEvents: 0, eventsByStatus: [], registrations: 0, registrationStatuses: [] });
    const denied = await fetch(`${base}/api/dashboard/admin`, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(denied.status, 403);
    const missingAuth = await fetch(`${base}/api/dashboard/admin`);
    assert.equal(missingAuth.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findById = originals.userFindById;
    User.countDocuments = originals.userCountDocuments;
    User.aggregate = originals.userAggregate;
    Event.countDocuments = originals.eventCountDocuments;
    Event.aggregate = originals.eventAggregate;
    Registration.countDocuments = originals.registrationCountDocuments;
    Registration.aggregate = originals.registrationAggregate;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
