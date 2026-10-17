const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const authorization = req.get("Authorization");
  const [scheme, token] = authorization ? authorization.split(" ") : [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      message: "Authentication is not configured on the server.",
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ message: "The authentication token is invalid or expired." });
  }

  if (typeof payload !== "object" || typeof payload.sub !== "string") {
    return res.status(401).json({ message: "The authentication token is invalid or expired." });
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ message: "The authentication token is invalid or expired." });
  }

  req.user = user.toJSON();
  return next();
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to access this resource." });
  }

  return next();
};

module.exports = { authenticateToken, authorizeRoles };
