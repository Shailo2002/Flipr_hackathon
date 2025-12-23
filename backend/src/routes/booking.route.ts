import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { handleBookTruck } from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/", isAuth, handleBookTruck);

export default bookingRouter;
