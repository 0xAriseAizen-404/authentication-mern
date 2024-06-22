import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "./asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedJWT.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, No token");
  }
});
