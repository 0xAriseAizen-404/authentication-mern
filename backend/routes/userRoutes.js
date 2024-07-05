import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { updateUser, deleteUser } from "../controllers/userControllers.js";

const router = express.Router();

router.route("/update/:id").put(authenticate, updateUser);
router.route("/delete/:id").delete(authenticate, deleteUser);

export default router;
