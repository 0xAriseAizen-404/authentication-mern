import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/createJWTtoken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signUpUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({ message: "Please check the credentials" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const userNameExists = await User.findOne({ username });
    if (userNameExists)
      return res.status(400).json({ message: "Username already exists" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    generateToken(res, newUser._id);
    newUser.password = null;
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Sign-up error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Please check the credentials" });

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(res, existingUser._id);
    existingUser.password = null;
    res.status(200).json(existingUser);
  } catch (error) {
    console.error("Sign-in error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const signInWithGoogle = asyncHandler(async (req, res) => {
  const { name, email, photoURL } = req.body;

  if (!name || !email || !photoURL) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      generateToken(res, userExists._id);
      userExists.password = null;
      return res.status(200).json(userExists);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatePassword, salt);

      const newUser = new User({
        username: `${name.split(" ").join("").toLowerCase()}${Math.floor(
          Math.random() * 10000
        )}`,
        email,
        profileImage: photoURL,
        password: hashedPassword,
      });

      await newUser.save();
      generateToken(res, newUser._id);
      newUser.password = null;
      return res.status(200).json(newUser);
    }
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const signOut = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "SignOut out successfully" });
});

export const forgetPassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      post: 465,
      secure: true,
      logger: true,
      debug: true,
      secureConnection: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
    <p>Click on the following link to reset your password:</p>
    <a href="http://localhost:5173/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(200).send({ message: "Email sent" });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  user.password = password;
  await user.save();

  res.status(200).send({ message: "Password reset successfully" });
});
