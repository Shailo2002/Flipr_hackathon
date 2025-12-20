import * as z from "zod";

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const DealerSingUpSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
  role: z.string(),
  dealer: z.object({
    truckTypes: z.array(z.string()),
    serviceAreas: z.array(z.string()),
  }),
});

export const WareHouseSingUpShema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
  role: z.string(),
  warehouse: z.object({
    companyName: z.string(),
    managerName: z.string(),
    location: z.string(),
  }),
});
