import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route  POST /api/auth/register
// @access Admin only (mount this route behind protect + authorize("admin"))
export const registerUser = async (req, res) => {
  try {
    const {
      role,
      fullName,
      username,
      email,
      password,
      phone,
      address,
      postcode,
      region,
      gender,
      dateOfBirth,
      maritalStatus,
      religion,
      ethnicity,
      positionAppliedFor,
      workPermitExpiry,
      nextOfKinName,
      nextOfKinPhone,
      jobTitle,
    } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "fullName, username, email and password are required",
      });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });
    if (existing) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    const user = await User.create({
      role, // "admin" | "staff" | "policy"
      fullName,
      username,
      email,
      password,
      phone,
      address,
      postcode,
      region,
      gender,
      dateOfBirth,
      maritalStatus,
      religion,
      ethnicity,
      positionAppliedFor,
      workPermitExpiry,
      nextOfKinName,
      nextOfKinPhone,
      jobTitle,
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  POST /api/auth/login
// @access Public
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (user.status !== "active") {
//       return res.status(403).json({ message: "Account is inactive. Contact admin." });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     const token = generateToken(user);

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//         username: user.username,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const clean = identifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ email: clean }, { username: clean }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Account is inactive. Contact admin." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
// @route  GET /api/auth/me
// @access Private (any authenticated role)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  POST /api/auth/logout
// @access Private
// JWT is stateless, so logout is handled client-side (discard token).
// This endpoint exists mainly so the frontend has something to call
// and so you can log it to the Audit Log (page 25 of the UI spec).
export const logoutUser = async (req, res) => {
  return res.status(200).json({ message: "Logged out" });
};
