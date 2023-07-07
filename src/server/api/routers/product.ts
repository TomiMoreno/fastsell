import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const Product = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
});
export type Product = z.infer<typeof Product>;

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  create: publicProcedure.input(Product).mutation(async ({ ctx, input }) => {
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
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
        },
      });
      return product;
    }),
});
