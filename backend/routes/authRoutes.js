import express from "express";
import {
  signInUser,
  signUpUser,
  signInWithGoogle,
  signOut,
  forgetPassword,
  resetPassword,
} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/signup").post(signUpUser);
router.route("/signin").post(signInUser);
router.route("/google").post(signInWithGoogle);
router.route("/signout").post(signOut);
router.route("/forgot-pass").post(forgetPassword);
router.route("/reset-pass/:token").post(resetPassword);

export default router;
