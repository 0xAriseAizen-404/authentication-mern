import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .json({ message: "You can update only your account!" });
  }
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .json({ message: "You can delete only your account!" });
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
