import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["WAREHOUSE", "DEALER"],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});


const User = mongoose.model("User", UserSchema);
export default User;