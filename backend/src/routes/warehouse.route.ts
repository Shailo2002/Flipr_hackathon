import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  handleCreateShipment,
  handleDeleteShipment,
  handleGetShipment,
  handleUpdateShipment,
  handleUpdateShipmentStatusByWarehouse,
} from "../controllers/warehouse.cotroller.js";

export const wareHouseRouter = express.Router();

wareHouseRouter.post("/shipment", isAuth, handleCreateShipment);
wareHouseRouter.get("/shipment", isAuth, handleGetShipment);
wareHouseRouter.put("/shipment", isAuth, handleUpdateShipment);
wareHouseRouter.delete("/shipment/:shipmentId", isAuth, handleDeleteShipment);
wareHouseRouter.put(
  "/shipment/status",
  isAuth,
  handleUpdateShipmentStatusByWarehouse
);
