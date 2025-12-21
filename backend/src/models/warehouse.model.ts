import mongoose from "mongoose";

const WareHouseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  managerName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});


const ShipmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },

    weight: {
      type: Number,
      required: true, 
    },

    volume: {
      type: Number,
      required: true, 
    },

    boxesCount: {
      type: Number,
    },

    destination: {
      type: String,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    optimization: {
      utilizationPercent: Number,
      estimatedCost: Number,
      estimatedCO2Saved: Number,
      recommendedTrucks: [
        {
          truckId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Truck",
          },
          score: Number,
        },
      ],
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    status: {
      type: String,
      enum: [
        "pending", 
        "optimized", 
        "booked", 
        "in_transit", 
        "delivered", 
        "cancelled",
      ],
      default: "pending",
      requied: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", ShipmentSchema);


const WareHouse = mongoose.model("WareHouse", WareHouseSchema);
const Shipment = mongoose.model("Shipment", ShipmentSchema);
export { WareHouse, Shipment };
