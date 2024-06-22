import express from "express";
import { signInUser, signUpUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(signUpUser)
router.route("/signin").post(signInUser);

export default router;
