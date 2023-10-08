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
      let total = 0;
      for (const productId of input.productMap.keys()) {
        const product = productsMap[productId];
        if (!product) throw new Error("Product not found");
        const saleData = input.productMap.get(productId);
        if (!saleData) throw new Error("Product not found 2");
        const amount = saleData.amount;
        const totalPrice = product.price * amount;
        total += totalPrice;
        // if (product.stock < amount) throw new Error("Not enough stock");
        await ctx.prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            stock: product.stock - amount,
          },
        });
        await ctx.prisma.productSale.create({
          data: {
            price: product.price,
            productId: product.id,
            saleId: sale.id,
            amount,
          },
        });
      }

      await ctx.prisma.sale.update({
        where: {
          id: sale.id,
        },
        data: {
          total,
        },
      });
      return sale;
    }),
  dashboard: publicProcedure.query(async ({ ctx }) => {
    const productSales = await ctx.prisma.productSale.aggregate({
      _sum: {
        amount: true,
      },
    });
    const sales = await ctx.prisma.sale.aggregate({
      _count: true,
      _sum: {
        total: true,
      },
    });

    const mostSoldProduct = (
      await ctx.prisma.productSale.groupBy({
        by: ["productId"],
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
        take: 1,
      })
    )?.[0];

    const mostSoldProductData = await ctx.prisma.product.findUnique({
      where: {
        id: mostSoldProduct?.productId,
      },
    });

    return {
      totalSold: productSales._sum.amount ?? 0,
      totalSales: sales._count ?? 0,
      totalSalesAmount: sales._sum.total ?? 0,
      mostSoldProduct: {
        ...mostSoldProductData,
        amount: mostSoldProduct?._sum.amount ?? 0,
      },
    };
  }),
  salesByProduct: publicProcedure.query(async ({ ctx }) => {
    const allProducts = await ctx.prisma.product.findMany();
    const productMap = new Map(
      allProducts.map((product) => [product.id, product])
    );
    const salesByProductAndPrice = await ctx.prisma.productSale.groupBy({
      by: ["productId", "price"],
      _sum: {
        amount: true,
      },
    });

    const salesByProductWithTotalPrice = salesByProductAndPrice.map((sale) => ({
      ...sale,
      totalPrice: (sale._sum.amount ?? 0) * sale.price,
      amount: sale._sum.amount ?? 0,
      product: productMap.get(sale.productId),
    }));

    const salesByProduct = salesByProductWithTotalPrice
      .reduce((acc, sale) => {
        const product = acc.find((p) => p.productId === sale.productId);
        if (product) {
          product.amount += sale._sum.amount ?? 0;
          product.totalPrice += sale.totalPrice;
        } else {
          acc.push(sale);
        }
        return acc;
      }, [] as typeof salesByProductWithTotalPrice)
      .sort((a, b) => b.totalPrice - a.totalPrice);

    return salesByProduct.map((sale) => ({
      ...sale.product,
      productId: sale.productId,
      amount: sale._sum.amount ?? 0,
      totalPrice: sale.totalPrice,
    }));
  }),
});
