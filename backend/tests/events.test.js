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
    eventFindOne: Event.findOne,
    eventFind: Event.find,
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
  Event.findOne = async (filter) => filter.organizer === organizerId ? null : null;
  let registrationOwnerFilter;
  Event.find = (filter) => {
    registrationOwnerFilter = filter.organizer;
    return { select: async () => [] };
  };
  Registration.find = () => {
    const query = { populate: () => query, sort: async () => [] };
    return query;
  };

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

    const editOtherEvent = await fetch(`${base}/api/events/64b000000000000000000099`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token(organizerId)}`, "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    assert.equal(editOtherEvent.status, 404);
    const cancelOtherEvent = await fetch(`${base}/api/events/64b000000000000000000099/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token(organizerId)}` },
    });
    assert.equal(cancelOtherEvent.status, 404);

    assert.equal((await fetch(`${base}/api/registrations/organizer`, {
      headers: { Authorization: `Bearer ${token(organizerId)}` },
    })).status, 200);
    assert.equal(registrationOwnerFilter, organizerId);
    assert.equal((await fetch(`${base}/api/registrations/organizer`, {
      headers: { Authorization: `Bearer ${token(studentId)}` },
    })).status, 403);

    const denied = await fetch(`${base}/api/events/64b000000000000000000099/registrations`, {
      headers: { Authorization: `Bearer ${token(organizerId)}` },
    });
    assert.equal(denied.status, 403);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findById = originals.userFindById;
    Event.create = originals.eventCreate;
    Event.findById = originals.eventFindById;
    Event.findOne = originals.eventFindOne;
    Event.find = originals.eventFind;
    Registration.find = originals.registrationFind;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
