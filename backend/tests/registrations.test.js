const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const jwt = require("jsonwebtoken");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const { app } = require("../server");

test("student registrations are authenticated, unique, and capacity limited", async () => {
  const originals = {
    userFindById: User.findById,
    eventFindById: Event.findById,
    eventFindOneAndUpdate: Event.findOneAndUpdate,
    eventUpdateOne: Event.updateOne,
    registrationFindOne: Registration.findOne,
    registrationFindOneAndUpdate: Registration.findOneAndUpdate,
    registrationCreate: Registration.create,
  };
  const originalSecret = process.env.JWT_SECRET;
  const secret = "registration-test-only-secret";
  const eventId = "64b000000000000000000021";
  const studentId = "64b000000000000000000022";
  const otherStudentId = "64b000000000000000000023";
  let count = 0;
  const records = [];
  const event = { _id: eventId, status: "Published", date: new Date("2099-07-20"), registrationDeadline: new Date("2099-07-19"), capacity: 1, registrationCount: 0 };
  process.env.JWT_SECRET = secret;
  User.findById = async (id) => ({ toJSON: () => ({ id, name: "Student", email: "student@example.edu", role: "student" }) });
  Event.findById = async () => event;
  Event.findOneAndUpdate = async (filter) => {
    if (filter.status !== "Published" || (filter.registrationCount && count >= filter.registrationCount.$lt)) return null;
    count += 1;
    return { ...event, registrationCount: count };
  };
  Event.updateOne = async (_filter, update) => { count += update.$inc.registrationCount; };
  Registration.findOne = async ({ student }) => records.find((item) => item.student === student && item.event === eventId) || null;
  Registration.findOneAndUpdate = async ({ student, event: eventRef, status }, update) => {
    const item = records.find((record) => record.student === student && record.event === eventRef && record.status === status);
    if (!item) return null;
    Object.assign(item, update);
    return item;
  };
  Registration.create = async (value) => {
    const record = { ...value, _id: "64b000000000000000000099", status: "Registered" };
    records.push(record);
    return record;
  };

  const server = app.listen(0);
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = (id) => jwt.sign({}, secret, { subject: id, expiresIn: "1h", algorithm: "HS256" });
  const register = (id) => fetch(`${base}/api/registrations/${eventId}`, { method: "POST", headers: { Authorization: `Bearer ${token(id)}`, "Content-Type": "application/json" }, body: JSON.stringify({ student: otherStudentId }) });
  try {
    assert.equal((await register(studentId)).status, 201);
    assert.equal(records[0].student, studentId);
    assert.equal((await register(studentId)).status, 409);
    const full = await register(otherStudentId);
    assert.equal(full.status, 409);
    assert.match((await full.json()).message, /full/i);
    assert.equal(count, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findById = originals.userFindById;
    Event.findById = originals.eventFindById;
    Event.findOneAndUpdate = originals.eventFindOneAndUpdate;
    Event.updateOne = originals.eventUpdateOne;
    Registration.findOne = originals.registrationFindOne;
    Registration.findOneAndUpdate = originals.registrationFindOneAndUpdate;
    Registration.create = originals.registrationCreate;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
