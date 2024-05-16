import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createProductSchema,
  updateProductSchema,
} from "~/lib/schemas/product";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { productsTable } from "~/server/db/schema";
import { ImageService } from "~/server/services/image";

export const productRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(productsTable).all();
  }),
  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const id = createId();
      const image = input.base64
        ? await ImageService.createFromBase64(input.base64, `product_${id}`)
        : "";
      const product = await ctx.db
        .insert(productsTable)
        .values({
          id,
          name: input.name,
          price: input.price,
          stock: input.stock,
          image,
          hotkey: null,
        })
        .returning()
        .then(([p]) => p);
      if (!product) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return product;
    }),
  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(productsTable)
        .set({
          ...input,
        })
        .where(eq(productsTable.id, input.id))
        .returning(),
    ),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(productsTable).where(eq(productsTable.id, input));
      await ImageService.deleteImage(`product_${input}`);
    }),
});
