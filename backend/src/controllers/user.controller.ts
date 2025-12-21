import mongoose from "mongoose";
import User from "../models/user.model.js";
import { WareHouse } from "../models/warehouse.model.js";
import Dealer from "../models/dealer.model.js";
import type { Request, Response } from "express";

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let roleData: any = null;

    if (user.role === "WAREHOUSE") {
      roleData = await WareHouse.findOne({ userId: user._id });
      if (!roleData)
        return res
          .status(404)
          .json({ success: false, message: "Warehouse not found" });
    } else if (user.role === "DEALER") {
      roleData = await Dealer.findOne({ userId: user._id });
      if (!roleData)
        return res
          .status(404)
          .json({ success: false, message: "Dealer not found" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...(user.role === "WAREHOUSE" && { warehouse: roleData }),
        ...(user.role === "DEALER" && { dealer: roleData }),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
