import { createSaleSchema } from "~/lib/schemas/product";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const saleRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  create: publicProcedure
    .input(createSaleSchema)
    .mutation(async ({ ctx, input }) => {
      const sale = await ctx.prisma.sale.create({
        data: {
          total: 0,
        },
      });
      const productsIds = [...input.productMap.keys()];
      console.log({ productsIds });
      const products = await ctx.prisma.product.findMany({
        where: {
          id: {
            in: productsIds,
          },
        },
      });
      const productsMap = products.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<string, (typeof products)[0]>);
      for (const productId of input.productMap.keys()) {
        const product = productsMap[productId];
        if (!product) throw new Error("Product not found");
        const saleData = input.productMap.get(productId);
        if (!saleData) throw new Error("Product not found 2");
        const amount = saleData.amount;
        // if (product.stock < amount) throw new Error("Not enough stock");
        console.log("here");
        await ctx.prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            stock: product.stock - amount,
          },
        });
        console.log("here2");
        await ctx.prisma.productSale.create({
          data: {
            price: product.price,
            productId: product.id,
            saleId: sale.id,
            amount,
          },
        });
      }
      console.log("end");
      return sale;
    }),
});
