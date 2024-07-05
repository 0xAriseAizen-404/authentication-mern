import express, { urlencoded } from "express";
import connectDB from "./config/dbConnection.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`App is listening on port - ${PORT}`);
  connectDB();
});

app.get("/", (req, res) => {
  res.json({ message: "Api is working" });
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
