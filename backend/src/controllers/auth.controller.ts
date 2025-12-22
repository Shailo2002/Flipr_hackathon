import mongoose from "mongoose";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import genToken from "../utils/token.js";
import { WareHouse } from "../models/warehouse.model.js";
import { Dealer } from "../models/dealer.model.js";

export const signUp = async (req: Request, res: Response) => {
  console.log("signup router check");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, role, dealer, warehouse } = req.body;

    if (!email || !password || !role) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const existingUser = await User.findOne({ email })
      .select("+password")
      .session(session);
    if (existingUser) {
      await session.abortTransaction();

      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userDoc] = await User.create(
      [
        {
          email,
          password: hashedPassword,
          role,
        },
      ],
      { session }
    );

    if (!userDoc) {
      throw new Error("User creation failed");
    }

    if (role === "WAREHOUSE") {
      if (!warehouse) {
        return res.status(400).json({
          success: false,
          message: "Warehouse details are required for WAREHOUSE role",
        });
      }

      const [warehouseDoc] = await WareHouse.create(
        [
          {
            userId: userDoc._id,
            companyName: warehouse.companyName,
            managerName: warehouse.managerName,
            location: warehouse.location,
          },
        ],
        { session }
      );

      if (!warehouseDoc) {
        throw new Error("Warehouse creation failed");
      }
    } else if (role === "DEALER") {
      if (!dealer) {
        return res.status(400).json({
          success: false,
          message: "Dealer details are required for DEALER role",
        });
      }

      const [dealerDoc] = await Dealer.create(
        [
          {
            userId: userDoc._id,
            dealerName: dealer.dealerName,
            serviceAreas: dealer.serviceAreas,
            truckTypes: dealer.truckTypes,
          },
        ],
        { session }
      );

      if (!dealerDoc) {
        throw new Error("Dealer creation failed");
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await genToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    let roleData: any = null;

    if (user.role === "WAREHOUSE") {
      roleData = await WareHouse.findOne({ userId: user._id });
      if (!roleData) {
        return res.status(404).json({
          success: false,
          message: "Warehouse not found",
        });
      }
    } else if (user.role === "DEALER") {
      roleData = await Dealer.findOne({ userId: user._id });
      if (!roleData) {
        return res.status(404).json({
          success: false,
          message: "Dealer not found",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
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
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during signin",
    });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Signout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during sign out",
    });
  }
};
