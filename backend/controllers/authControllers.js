import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/createJWTtoken.js";

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
