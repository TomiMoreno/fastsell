import { z } from "zod";
import { type RouterOutputs } from "~/utils/api";

export const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;

export type Product = RouterOutputs["product"]["getAll"][0];
