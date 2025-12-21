import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  userId: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in.",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as AuthPayload;


    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error: unknown) {
    const err = error as Error & { name?: string };
    console.error("Token verification error:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};
