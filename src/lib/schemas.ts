import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
});
