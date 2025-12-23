import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  handleAddTruck,
  handleDeleteTruck,
  handleEditTruck,
  handleGetAllTrucks,
  handleGetDealerBookings,
  handleUpdateTruckStatus,
} from "../controllers/dealer.controller.js";

const dealerRouter = express.Router();

dealerRouter.post("/truck", isAuth, handleAddTruck);
dealerRouter.get("/truck", isAuth, handleGetAllTrucks);
dealerRouter.put("/truck", isAuth, handleEditTruck);
dealerRouter.delete("/truck/:truckId", isAuth, handleDeleteTruck)
dealerRouter.patch("/truck/status", isAuth, handleUpdateTruckStatus);
dealerRouter.get("/bookings",isAuth,handleGetDealerBookings)

export default dealerRouter;
