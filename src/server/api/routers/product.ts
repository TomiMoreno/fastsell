import {
  createProductSchema,
  updateProductSchema,
} from "~/lib/schemas/product";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          stock: input.stock,
          image: "https://picsum.photos/200",
        },
      });
      return product;
    }),
  update: publicProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
          stock: input.stock,
        },
      });
      return product;
    }),
});
