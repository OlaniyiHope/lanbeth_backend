import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Auth from "../models/authModel.js";
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_AUTH_REDIRECT_URI
);

export const signUp = async (req, res, next) => {
  const { fullname, username, email, phone, password } = req.body;

  console.log("Received signup request:", req.body);

  if (!fullname || !email || !password) {
    console.log("Missing required fields");
    return res
      .status(400)
      .json({ message: "Fullname, email, and password are required" });
  }

  try {
    let user = await Auth.findOne({ email });
    console.log("Checking if user exists:", user);

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("Hashed password:", hashedPassword);

      user = new Auth({
        fullname,
        username,
        phone,
        email,
        password: hashedPassword,
      });

      console.log("New user object before saving:", user);

      // Generate JWT tokens
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Store tokens in the DB
      user.accessToken = token;
      user.refreshToken = refreshToken;

      const savedUser = await user.save();
      console.log("User saved successfully:", savedUser);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        user: savedUser,
        token: savedUser.accessToken,
        refreshToken: savedUser.refreshToken,
      });
    } else {
      console.log("User already exists");
      res.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    next(error);
  }
};

// export const login = async (req, res, next) => {
//   const { email, password, googleToken } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (googleToken) {
//       const ticket = await oauth2Client.verifyIdToken({
//         idToken: googleToken,
//         audience: process.env.GOOGLE_CLIENT_ID,
//       });
//       const payload = ticket.getPayload();

//       if (user.googleId !== payload.sub) {
//         return res.status(401).json({ message: "Invalid Google token" });
//       }

//       // const token = jwt.sign(
//       //   { id: user._id, isAdmin: user.isAdmin },
//       //   process.env.JWT_SECRET,
//       //   { expiresIn: "1h" }
//       // );
//       const token = jwt.sign(
//         { userId: user._id, isAdmin: user.isAdmin }, // Change `id` to `userId`
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       res.status(200).json({
//         accessToken: user.accessToken,
//         refreshToken: user.refreshToken,
//         token,
//         user,
//       });
//     } else {
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: "Invalid password" });
//       }

//       const token = jwt.sign(
//         { id: user._id, isAdmin: user.isAdmin },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       res.status(200).json({
//         accessToken: user.accessToken,
//         refreshToken: user.refreshToken,
//         token,
//         user,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const login = async (req, res, next) => {
  const { email, password, googleToken } = req.body;
  console.log("Login Request Received:", { email, googleToken });

  try {
    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (googleToken) {
      const ticket = await oauth2Client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (user.googleId !== payload.sub) {
        return res.status(401).json({ message: "Invalid Google token" });
      }
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    // const token = jwt.sign(
    //   { userId: user._id, isAdmin: user.isAdmin },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("Profile Request Received. User in Request:", req.user);

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found or token invalid" });
    }

    // const user = await User.findById(req.user.userId).select("-password");
    const user = await Auth.findById(req.user._id).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = (req, res) => {
  // Handle forgot password
  // You can implement email sending logic here
  res.send("Password reset link sent!");
};
