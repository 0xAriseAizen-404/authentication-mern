import express, { urlencoded } from "express";
import connectDB from "./config/dbConnection.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

const __dirname = path.resolve();

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`App is listening on port - ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});
