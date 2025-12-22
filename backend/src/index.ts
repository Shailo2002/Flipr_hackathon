import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { wareHouseRouter } from "./routes/warehouse.route.js";
import userRouter from "./routes/user.route.js";
import dealerRouter from "./routes/dealer.route.js";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/warehouse", wareHouseRouter);
app.use("/api/user",userRouter)
app.use("/api/dealer", dealerRouter);



app.listen(3000, () => {
  connectDb();
  console.log("Server is running on http://localhost:3000");
});
