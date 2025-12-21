import * as z from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const ShipmentSchema = z.object({
  weight: z.number().gt(0, { message: "Weight must be greater than 0" }),
  volume: z.number().gt(0, { message: "Volume must be greater than 0" }),
  boxesCount: z.number().gt(0, { message: "Boxe Count must be greater than 0" }),
  destination: z.string(),
  deadline: z.coerce.date().refine(
    (d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: "Deadline must be today or later" }
  ),
});
