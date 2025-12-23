import type { Request, Response } from "express";
import { Shipment, WareHouse } from "../models/warehouse.model.js";
import mongoose from "mongoose";
import { runShipmentOptimization } from "../services/optimization.service.js";

export const handleCreateShipment = async (req: Request, res: Response) => {
  try {
    const { warehouseId, weight, volume, boxesCount, destination, deadline } =
      req.body;

    if (
      !warehouseId ||
      weight == null ||
      volume == null ||
      !destination ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "warehouseId, weight, volume, destination and deadline are required.",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const checkWarehouse = await WareHouse.findOne({
      _id: warehouseId,
      userId,
    });

    if (!checkWarehouse) {
      return res.status(403).json({
        success: false,
        message: "Invalid warehouseId or access denied.",
      });
    }

    const shipment = await Shipment.create({
      userId,
      warehouseId: checkWarehouse._id,
      weight,
      volume,
      boxesCount,
      destination,
      deadline,
    });

    return res.status(201).json({
      success: true,
      message: "Shipment created successfully.",
      data: shipment,
    });
  } catch (error) {
    console.error("Shipment create error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating shipment.",
    });
  }
};

export const handleGetShipment = async (req: Request, res: Response) => {
  try {
    console.log("get shipment route check");
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in.",
      });
    }

    const shipments = await Shipment.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return res.status(200).json({
      success: true,
      data: shipments,
    });
  } catch (error) {
    console.error("Shipment fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleUpdateShipment = async (req: Request, res: Response) => {
  try {
    console.log("edit shipment check route");
    const { weight, volume, destination, deadline, boxesCount, shipmentId } =
      req.body;

    if (
      weight == null ||
      volume == null ||
      !destination ||
      !deadline ||
      !shipmentId ||
      !boxesCount
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipment details are required.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    const warehouse = await WareHouse.findOne({
      _id: shipment.warehouseId,
      userId,
    });

    if (!warehouse) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    shipment.weight = weight;
    shipment.volume = volume;
    shipment.destination = destination;
    shipment.deadline = deadline;
    shipment.boxesCount = boxesCount;

    await shipment.save();

    return res.status(200).json({
      success: true,
      message: "Shipment updated successfully.",
      data: shipment,
    });
  } catch (error) {
    console.error("Shipment update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating shipment.",
    });
  }
};

export const handleDeleteShipment = async (req: Request, res: Response) => {
  try {
    console.log("shipment delete route check");
    const { shipmentId } = req.params;

    if (!shipmentId) {
      return res.status(400).json({
        success: false,
        message: "Shipment ID is required.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    const warehouse = await WareHouse.findOne({
      _id: shipment.warehouseId,
      userId,
    });

    if (!warehouse) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    await shipment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Shipment deleted successfully.",
    });
  } catch (error) {
    console.error("Shipment delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting shipment.",
    });
  }
};

export const handleUpdateShipmentStatusByWarehouse = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("warehouse status route check");

    const { shipmentId, status } = req.body;

    if (!shipmentId || !status) {
      return res.status(400).json({
        success: false,
        message: "shipmentId and status are required.",
      });
    }

    const warehouseAllowedStatuses = ["pending", "optimized", "cancelled"];

    if (!warehouseAllowedStatuses.includes(status)) {
      return res.status(403).json({
        success: false,
        message:
          "Warehouse users can only set status to pending, optimized, or cancelled.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const shipment = await Shipment.findOne({ _id: shipmentId, userId });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found or access denied.",
      });
    }

    const dealerControlledStates = ["booked", "in_transit", "delivered"];
    if (dealerControlledStates.includes(shipment.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot change status once shipment is handled by a dealer.",
      });
    }

    // 1. Update status

    // 2. If optimized → run optimization
    if (status === "optimized") {
      const optimizedTrucks = await runShipmentOptimization(shipment);

      if (optimizedTrucks.length > 0 || optimizedTrucks === undefined) {
        shipment.status = status;
        shipment.set("optimization.recommendedTrucks", optimizedTrucks);
        await shipment.save();
        return res.status(200).json({
          success: true,
          message: "Shipment optimized successfully.",
          data: {
            shipment,
            optimizedTrucks,
          },
        });
      }
      shipment.status = status;
      await shipment.save();

      return res.status(200).json({
        success: true,
        message: "No Trucks available, Optimise later!",
        data: {
          shipment,
          optimizedTrucks,
        },
      });
    }

    // 3. Normal response for other statuses
    return res.status(200).json({
      success: true,
      message: "Shipment status updated successfully.",
      data: { shipment },
    });
  } catch (error) {
    console.error("Warehouse status update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating shipment status.",
    });
  }
};
