import mongoose from "mongoose";

const DealerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  dealerName: {
    type: String,
    required: true,
  },
  serviceAreas: {
    type: [String],
    required: true,
  },
  truckTypes: {
    type: [String],
    enums: [
      "MINI_TRUCK",
      "LCV_14FT",
      "LCV_17FT",
      "TRUCK_19FT",
      "TRUCK_22FT",
      "TRUCK_24FT",
      "TRUCK_32FT_SXL",
      "TRUCK_40FT",
    ],
    required: true,
  },
});

const Dealer = mongoose.model("Dealer", DealerSchema)
export default Dealer;