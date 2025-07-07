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
    return ctx.db.query.productsTable.findMany({
      where: (t, { eq }) => eq(t.organizationId, ctx.session.organizationId),
    });
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
          hotkey: input.hotkey ?? null,
          category: input.category ?? null,
          organizationId: ctx.session.organizationId,
        })
        .returning()
        .then(([p]) => p);
      if (!product) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return product;
    }),
  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const image = input.base64
        ? await ImageService.createFromBase64(
            input.base64,
            `product_${input.id}_${Date.now()}`,
          )
        : undefined;
      return ctx.db
        .update(productsTable)
        .set({
          ...input,
          image,
        })
        .where(eq(productsTable.id, input.id))
        .returning();
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(productsTable).where(eq(productsTable.id, input));
      await ImageService.deleteImage(`product_${input}`);
    }),
});
