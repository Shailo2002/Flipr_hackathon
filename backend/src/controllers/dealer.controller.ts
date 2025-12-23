import type { Request, Response } from "express";
import { Dealer, Truck } from "../models/dealer.model.js";
import Booking from "../models/booking.model.js";

export const handleAddTruck = async (req: Request, res: Response) => {
  try {
    console.log("add truck route check");
    const { dealerId, capacity, type, location } = req.body;

    if (!dealerId || capacity == null || !type || !location) {
      return res.status(400).json({
        success: false,
        message: "dealerId, capacity, type, and location are required.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const dealer = await Dealer.findOne({
      _id: dealerId,
      userId,
    });

    if (!dealer) {
      return res.status(403).json({
        success: false,
        message: "Invalid dealerId or access denied.",
      });
    }

    // cast to any to satisfy mongoose typings for fields named 'type' / enum definitions
    const truck = await Truck.create({
      dealerId: dealer._id,
      capacity,
      type,
      location,
      status: "available",
    } as any);

    return res.status(201).json({
      success: true,
      message: "Truck added successfully.",
      data: truck,
    });
  } catch (error) {
    console.error("Add truck error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding truck.",
    });
  }
};

export const handleGetAllTrucks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // 1. Auth check
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // 2. Find dealer linked to this user
    const dealer = await Dealer.findOne({ userId });

    if (!dealer) {
      return res.status(403).json({
        success: false,
        message: "Dealer account not found for this user.",
      });
    }

    // 3. Fetch trucks using dealer._id
    const trucks = await Truck.find({ dealerId: dealer._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: trucks,
    });
  } catch (error) {
    console.error("Get trucks error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching trucks.",
    });
  }
};

export const handleEditTruck = async (req: Request, res: Response) => {
  try {
    console.log("edit truck route check");
    const { truckId, capacity, type, location, status } = req.body;

    if (!truckId || capacity == null || !type || !location || !status) {
      return res.status(400).json({
        success: false,
        message: "truckId, capacity, type, location and status are required.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const dealer = await Dealer.findOne({ userId });

    if (!dealer) {
      return res.status(403).json({
        success: false,
        message: "Dealer account not found for this user.",
      });
    }

    const updatedTruck = await Truck.findOneAndUpdate(
      {
        _id: truckId,
        dealerId: dealer._id,
      },
      {
        capacity,
        type,
        location,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTruck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Truck updated successfully.",
      data: updatedTruck,
    });
  } catch (error) {
    console.error("Edit truck error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating truck.",
    });
  }
};

export const handleDeleteTruck = async (req: Request, res: Response) => {
  try {
    console.log("delete truck route check");

    const truckId = req.params.truckId;

    console.log("truckId : ", truckId);
    if (!truckId) {
      return res.status(400).json({
        success: false,
        message: "truckId is required.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const dealer = await Dealer.findOne({ userId });
    if (!dealer) {
      return res.status(403).json({
        success: false,
        message: "Dealer account not found for this user.",
      });
    }

    const truck = await Truck.findOne({
      _id: truckId,
      dealerId: dealer._id,
    });

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found or access denied.",
      });
    }

    if (truck.status === "booked") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a booked truck.",
      });
    }

    await Truck.deleteOne({ _id: truckId });

    return res.status(200).json({
      success: true,
      message: "Truck deleted successfully.",
    });
  } catch (error) {
    console.error("Delete truck error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting truck.",
    });
  }
};

const ALLOWED_STATUSES = [
  "available",
  "booked",
  "in_transit",
  "delivered",
  "cancelled",
] as const;

export const handleUpdateTruckStatus = async (req: Request, res: Response) => {
  try {
    console.log("update truck status route check");

    const { truckId, status } = req.body;

    if (!truckId || !status) {
      return res.status(400).json({
        success: false,
        message: "truckId and status are required.",
      });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid truck status.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Find dealer owned by this user
    const dealer = await Dealer.findOne({ userId });
    if (!dealer) {
      return res.status(403).json({
        success: false,
        message: "Dealer access denied.",
      });
    }

    // Find truck owned by this dealer
    const truck = await Truck.findOne({
      _id: truckId,
      dealerId: dealer._id,
    });

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found.",
      });
    }

    // Optional: enforce status flow
    // const validTransitions: Record<string, string[]> = {
    //   available: ["in_transit","booked", "cancelled"],
    //   booked: ["in_transit", "cancelled"],
    //   in_transit: ["delivered"],
    //   delivered: [],
    //   cancelled: [],
    // };

    // const allowedNext = validTransitions[truck.status as keyof typeof validTransitions] ?? [];
    // if (!allowedNext.includes(status)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Cannot change status from ${truck.status} to ${status}.`,
    //   });
    // }

    truck.status = status;
    await truck.save();

    return res.status(200).json({
      success: true,
      message: "Truck status updated successfully.",
      data: truck,
    });
  } catch (error) {
    console.error("Update truck status error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating truck status.",
    });
  }
};

export const handleGetDealerBookings = async (req: Request, res: Response) => {
  try {
    console.log("get dealer bookings route check");

    // 1. Auth check
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // 2. Find dealer by userId
    const dealer = await Dealer.findOne({ userId });

    if (!dealer) {
      return res.status(403).json({
        success: false,
        message: "Dealer account not found for this user.",
      });
    }

    // 3. Fetch bookings for this dealer
    const bookings = await Booking.find({ dealerId: dealer._id })
      .populate("shipmentId")
      .populate("truckId")
      .populate("warehouseId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get dealer bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching bookings.",
    });
  }
};
