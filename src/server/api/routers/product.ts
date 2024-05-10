import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createProductSchema,
  updateProductSchema,
} from "~/lib/schemas/product";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { productsTable } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(productsTable).all();
  }),
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db
        .insert(productsTable)
        .values({
          name: input.name,
          price: input.price,
          stock: input.stock,
          image: "https://picsum.photos/200",
          hotkey: null,
        })
        .returning()
    ),
  update: publicProcedure
    .input(updateProductSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(productsTable)
        .set({
          ...input,
        })
        .where(eq(productsTable.id, input.id))
        .returning()
    ),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(productsTable).where(eq(productsTable.id, input));
  }),
});
