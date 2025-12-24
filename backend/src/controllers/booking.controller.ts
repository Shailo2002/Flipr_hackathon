import type { Request, Response } from "express";
import Booking from "../models/booking.model.js";
import { Dealer, Truck } from "../models/dealer.model.js";
import { Shipment, WareHouse } from "../models/warehouse.model.js";

export const handleBookTruck = async (req: Request, res: Response) => {
  try {
    console.log("book truck route check");

    const { shipmentId, truckId, price, estimatedCO2Saved } = req.body;

    // 1. Validate input
    if (!shipmentId || !truckId || price == null) {
      return res.status(400).json({
        success: false,
        message: "shipmentId, truckId and price are required.",
      });
    }

    // 2. Auth check
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // 🔒 3. Check if booking already exists for this shipment
    const existingBooking = await Booking.findOne({ shipmentId });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This shipment is already booked.",
      });
    }

    // 4. Fetch shipment (warehouse-owned & optimized)
    const shipment = await Shipment.findOne({
      _id: shipmentId,
      userId,
      status: "optimized",
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found or not optimized.",
      });
    }

    // 5. Fetch warehouse
    const warehouse = await WareHouse.findOne({ userId });
    if (!warehouse) {
      return res.status(403).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    // 6. Fetch truck (must be available)
    const truck = await Truck.findOne({
      _id: truckId,
      status: "available",
    });

    if (!truck) {
      return res.status(400).json({
        success: false,
        message: "Truck not available for booking.",
      });
    }

    // 7. Fetch dealer
    const dealer = await Dealer.findOne({ _id: truck.dealerId });
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found.",
      });
    }

    // 8. Create booking
    const booking = await Booking.create({
      shipmentId,
      truckId,
      dealerId: dealer._id,
      warehouseId: warehouse._id,
      bookedBy: userId,
      price,
      estimatedCO2Saved,
      pickup: warehouse?.location,
      destination: shipment?.destination,
    });

    // 9. Update shipment + truck
    shipment.status = "waiting";
    shipment.bookingId = booking._id;
    await shipment.save();

    return res.status(201).json({
      success: true,
      message: "Truck booked successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while booking truck.",
    });
  }
};

export const handleAcceptBooking = async (req: Request, res: Response) => {
  try {
    console.log("Accept Booking route check");

    const { bookingId, status } = req.body;

    if (!bookingId == null) {
      return res.status(400).json({
        success: false,
        message: "bookingId are required.",
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
      return res.status(404).json({
        success: false,
        message: "Dealer not found.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      dealerId: dealer._id,
    });

    if (!booking) {
      return res.status(409).json({
        success: false,
        message: "Shipment not booked yet.",
      });
    }

    if (booking.status !== "waiting") {
      return res.status(400).json({
        success: false,
        message: "Booking already processed.",
      });
    }

    const shipment = await Shipment.findById(booking.shipmentId);
    const truck = await Truck.findById(booking.truckId);

    if (!shipment || !truck) {
      return res.status(404).json({
        success: false,
        message: "Related shipment or truck not found.",
      });
    }

    if (status === true) {
      booking.status = "booked";
      truck.status = "booked";
      shipment.status = "booked";
    } else {
      booking.status = "cancelled";
      shipment.status = "cancelled";
      truck.status = "available";
    }
    await Promise.all([booking.save(), shipment.save(), truck.save()]);

    return res.status(200).json({
      success: true,
      message: status
        ? "Booking accepted successfully."
        : "Booking rejected successfully.",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while booking truck.",
    });
  }
};
