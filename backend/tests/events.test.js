const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const jwt = require("jsonwebtoken");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const { app } = require("../server");

test("event APIs enforce organizer roles and ownership", async () => {
  const originals = {
    userFindById: User.findById,
    eventCreate: Event.create,
    eventFindById: Event.findById,
    registrationFind: Registration.find,
  };
  const originalSecret = process.env.JWT_SECRET;
  const secret = "event-route-test-only-secret";
  const organizerId = "64b000000000000000000001";
  const studentId = "64b000000000000000000002";
  const otherOrganizerId = "64b000000000000000000003";
  const created = [];
  process.env.JWT_SECRET = secret;
  User.findById = async (id) => ({
    _id: id,
    toJSON: () => ({ id, name: "Test User", email: "test@example.edu", role: id === organizerId ? "organizer" : id === studentId ? "student" : "admin" }),
  });
  Event.create = async (values) => { created.push(values); return values; };
  Event.findById = async () => ({ organizer: otherOrganizerId });
  Registration.find = () => ({ populate: () => ({ sort: async () => [] }) });

  const server = app.listen(0);
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = (id) => jwt.sign({}, secret, { subject: id, expiresIn: "1h", algorithm: "HS256" });
  const post = async (body, authorization) => fetch(`${base}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
    body: JSON.stringify(body),
  });

  try {
    const values = {
      title: "Integration Workshop", description: "Workshop description", category: "Workshops",
      date: "2099-07-20", startTime: "10:00", endTime: "11:00", location: "Campus Hall",
      capacity: 25, registrationDeadline: "2099-07-19", status: "Published", organizer: otherOrganizerId,
    };
    assert.equal((await post(values)).status, 401);
    assert.equal((await post(values, `Bearer ${token(studentId)}`)).status, 403);
    const response = await post(values, `Bearer ${token(organizerId)}`);
    assert.equal(response.status, 201);
    assert.equal(created[0].organizer, organizerId);
    assert.equal(created[0].status, "Pending");

    const denied = await fetch(`${base}/api/events/64b000000000000000000099/registrations`, {
      headers: { Authorization: `Bearer ${token(organizerId)}` },
    });
    assert.equal(denied.status, 403);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findById = originals.userFindById;
    Event.create = originals.eventCreate;
    Event.findById = originals.eventFindById;
    Registration.find = originals.registrationFind;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
