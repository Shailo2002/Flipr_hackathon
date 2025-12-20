import mongoose from "mongoose";

const WareHouseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
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

const WareHouse = mongoose.model("WareHouse", WareHouseSchema)
export default WareHouse;