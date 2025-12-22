import { z } from "zod";

export const TruckSchema = z.object({
  capacity: z.number().positive("Capacity must be greater than 0"),

  type: z.string().min(1, "Truck type is required"),

  location: z.string().min(1, "Location is required"),

  status: z.enum([
    "available",
    "booked",
    "in_transit",
    "delivered",
    "cancelled",
  ]),
});
