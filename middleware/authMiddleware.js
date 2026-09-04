import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

// Verifies JWT, attaches req.user (the full user document, minus password)
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // authController signs { id: user._id, role: user.role } — flat, not nested

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User no longer exists" });
    }
    if (user.status !== "active") {
      return res.status(403).json({ error: "Account is inactive" });
    }

    req.user = user; // full user doc: _id, role, fullName, email, ...
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// Usage: authorize("admin") or authorize("admin", "policy")
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role '${req.user?.role}' is not permitted to access this resource`,
      });
    }
    next();
  };
};