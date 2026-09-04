import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

export const protect = async (req, res, next) => {
  let token;
  console.log("Checking authorization header...");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Extracted Token:", token);
  }

  if (!token) {
    console.log("No token found. Unauthorized request.");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    console.log("Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await Auth.findById(decoded._id).select("-password");
    if (!user) {
      console.log("User not found in the database.");
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    console.log("User found:", user);
    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
