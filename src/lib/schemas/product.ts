import { z } from "zod";

const hotkey = z
  .string()
  .max(1)
  .transform((v) => v || null)
  .nullable();

export const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  hotkey,
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  hotkey,
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;

export type Product = z.infer<typeof product>;

const product = z.object({
  id: z.string(),
  name: z.string(),
  hotkey,
  price: z.number(),
  stock: z.number(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSaleSchema = z.object({
  productMap: z.map(
    z.string(),
    z.object({
      amount: z.number(),
      product,
    })
  ),
});
