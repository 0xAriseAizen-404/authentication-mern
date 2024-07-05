import express from "express";
import {
  signInUser,
  signUpUser,
  signInWithGoogle,
} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/signup").post(signUpUser);
router.route("/signin").post(signInUser);
router.route("/google").post(signInWithGoogle);

export default router;
