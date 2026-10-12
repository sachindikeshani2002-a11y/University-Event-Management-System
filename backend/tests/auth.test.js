const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { app } = require("../server");
const { authorizeRoles } = require("../middleware/authMiddleware");

test("authentication routes and role authorization", async () => {
  const originalMethods = {
    findOne: User.findOne,
    findById: User.findById,
    create: User.create,
  };
  const originalSecret = process.env.JWT_SECRET;
  const testSecret = "unit-test-only-secret-not-for-production";
  const users = new Map();
  process.env.JWT_SECRET = testSecret;

  const makeQuery = (promise) => ({
    select() {
      return this;
    },
    then(resolve, reject) {
      return promise.then(resolve, reject);
    },
  });

  User.findOne = ({ email }) => makeQuery(Promise.resolve(users.get(email) || null));
  User.findById = async (id) =>
    [...users.values()].find((user) => user._id.toString() === id) || null;
  User.create = async ({ name, email, password, role }) => {
    if (users.has(email)) {
      const error = new Error("Duplicate email");
      error.code = 11000;
      throw error;
    }

    const user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role,
    });
    users.set(email, user);
    return user;
  };

  const server = app.listen(0);
  await once(server, "listening");
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const request = async (path, body, headers = {}) => {
    const response = await fetch(`${baseUrl}${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, body: await response.json() };
  };

  try {
    const missingFields = await request("/api/auth/register", { email: "alex@example.edu" });
    assert.equal(missingFields.status, 400);

    const invalidEmail = await request("/api/auth/register", {
      name: "Alex Student",
      email: "not-an-email",
      password: "test-password",
    });
    assert.equal(invalidEmail.status, 400);

    const registration = await request("/api/auth/register", {
      name: "Alex Student",
      email: "Alex@Example.edu",
      password: "test-password",
      role: "admin",
    });
    assert.equal(registration.status, 201);
    assert.equal(registration.body.user.email, "alex@example.edu");
    assert.equal(registration.body.user.role, "student");
    assert.equal(Object.hasOwn(registration.body.user, "password"), false);
    assert.notEqual(users.get("alex@example.edu").password, "test-password");
    assert.equal(await users.get("alex@example.edu").comparePassword("test-password"), true);

    const duplicate = await request("/api/auth/register", {
      name: "Alex Student",
      email: "alex@example.edu",
      password: "another-password",
    });
    assert.equal(duplicate.status, 409);

    const wrongPassword = await request("/api/auth/login", {
      email: "alex@example.edu",
      password: "wrong-password",
    });
    const unknownEmail = await request("/api/auth/login", {
      email: "unknown@example.edu",
      password: "wrong-password",
    });
    assert.equal(wrongPassword.status, 401);
    assert.equal(wrongPassword.body.message, unknownEmail.body.message);

    const login = await request("/api/auth/login", {
      email: "ALEX@example.edu",
      password: "test-password",
    });
    assert.equal(login.status, 200);
    assert.equal(login.body.user.role, "student");
    assert.equal(Object.hasOwn(login.body.user, "password"), false);
    assert.equal(jwt.verify(login.body.token, testSecret).sub, registration.body.user.id);

    const noToken = await request("/api/auth/me");
    assert.equal(noToken.status, 401);

    const profile = await request("/api/auth/me", null, {
      Authorization: `Bearer ${login.body.token}`,
    });
    assert.equal(profile.status, 200);
    assert.equal(profile.body.user.email, "alex@example.edu");
    assert.equal(Object.hasOwn(profile.body.user, "password"), false);

    const badToken = await request("/api/auth/me", null, {
      Authorization: "Bearer invalid-token",
    });
    assert.equal(badToken.status, 401);

    const runRoleCheck = (role, allowedRoles) =>
      new Promise((resolve) => {
        const response = {
          statusCode: 200,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json() {
            resolve(this.statusCode);
          },
        };
        authorizeRoles(...allowedRoles)(
          { user: role ? { role } : null },
          response,
          () => resolve(200)
        );
      });

    assert.equal(await runRoleCheck("admin", ["admin"]), 200);
    assert.equal(await runRoleCheck("student", ["admin"]), 403);
    assert.equal(await runRoleCheck(null, ["student"]), 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    User.findOne = originalMethods.findOne;
    User.findById = originalMethods.findById;
    User.create = originalMethods.create;
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  }
});
