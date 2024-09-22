import { z } from "zod";

export const paymentCreatedSchema = z.object({
  title: z.string().optional(),
  email: z.string().email(),
  price: z.number().min(1),
});
