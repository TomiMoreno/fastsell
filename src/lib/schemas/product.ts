import { endOfDay, startOfDay } from "date-fns";
import { z } from "zod";

const hotkey = z
  .string()
  .max(1)
  .optional()
  .transform((v) => v ?? null)
  .nullable();

export const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  base64: z.string().optional(),
  hotkey,
  category: z.string().optional(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  base64: z.string().optional(),
  hotkey,
  category: z.string().optional(),
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
  category: z.string().nullable(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSaleSchema = z.object({
  productMap: z.map(
    z.string(),
    z.object({
      amount: z.number(),
      product,
    }),
  ),
});

export const dashboardSchema = z.object({
  dateRange: z.object({
    from: z
      .date()
      .optional()
      .transform((v) => startOfDay(v ?? new Date(0))),
    to: z
      .date()
      .optional()
      .transform((v) => v && endOfDay(v)),
  }),
});
