import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { wareHouseRouter } from "./routes/warehouse.route.js";
import userRouter from "./routes/user.route.js";
import dealerRouter from "./routes/dealer.route.js";
import bookingRouter from "./routes/booking.route.js";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://flipr-hackathon-azure.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/warehouse", wareHouseRouter);
app.use("/api/user", userRouter);
app.use("/api/dealer", dealerRouter);
app.use("/api/booking", bookingRouter);

await connectDb();

export default app;
