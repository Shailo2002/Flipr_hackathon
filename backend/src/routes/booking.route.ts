import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { handleAcceptBooking, handleBookTruck } from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/", isAuth, handleBookTruck);
bookingRouter.put("/accept", isAuth, handleAcceptBooking);

export default bookingRouter;
