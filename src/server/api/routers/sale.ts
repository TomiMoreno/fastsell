import { count, eq, sum } from "drizzle-orm";
import { createSaleSchema } from "~/lib/schemas/product";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  productSalesTable,
  productsTable,
  salesTable,
} from "~/server/db/schema";

export const saleRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(salesTable).all();
  }),
  create: publicProcedure
    .input(createSaleSchema)
    .mutation(async ({ ctx, input }) => {
      // First we create a sale to store ProductSales in it.
      const sale = await ctx.db
        .insert(salesTable)
        .values({ total: 0 })
        .returning()
        .then((res) => res.at(0));
      if (!sale) throw new Error("Sale not created");
      const productsIds = [...input.productMap.keys()];
      const products = await ctx.db.query.productsTable.findMany({
        where: ({ id }, { inArray }) => inArray(id, productsIds),
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
        // TODO: parallelize this
        await ctx.db
          .update(productsTable)
          .set({
            stock: product.stock - amount,
          })
          .where(eq(productsTable.id, productId));

        await ctx.db.insert(productSalesTable).values({
          price: product.price,
          productId: product.id,
          saleId: sale.id,
          amount,
        });
      }

      await ctx.db
        .update(salesTable)
        .set({
          total,
        })
        .where(eq(salesTable.id, sale.id));

      return sale;
    }),
  dashboard: publicProcedure.query(async ({ ctx }) => {
    const allProducts = await ctx.db.select().from(productsTable).all();
    const productMap = new Map(
      allProducts.map((product) => [product.id, product])
    );
    const salesByProductAndPrice = await ctx.db
      .select({
        amount: sum(productSalesTable.amount).mapWith(Number),
        price: productSalesTable.price,
        productId: productSalesTable.productId,
      })
      .from(productSalesTable)
      .groupBy(productSalesTable.productId, productSalesTable.price);

    const { numberOfSales } = (await ctx.db
      .select({
        total: sum(salesTable.total).mapWith(Number),
        numberOfSales: count(),
      })
      .from(salesTable)
      .then((res) => res.at(0))) || { total: 0, numberOfSales: 0 };

    const salesByProductWithTotalPrice = salesByProductAndPrice.map((sale) => ({
      ...sale,
      totalPrice: (sale.amount ?? 0) * sale.price,
      amount: sale.amount ?? 0,
      product: productMap.get(sale.productId),
    }));

    const salesByProduct = salesByProductWithTotalPrice
      .reduce((acc, sale) => {
        const product = acc.find((p) => p.productId === sale.productId);
        if (product) {
          product.amount += sale.amount ?? 0;
          product.totalPrice += sale.totalPrice;
        } else {
          acc.push(sale);
        }
        return acc;
      }, [] as typeof salesByProductWithTotalPrice)
      .sort((a, b) => b.totalPrice - a.totalPrice)
      .map((sale) => ({
        ...sale.product,
        productId: sale.productId,
        amount: sale.amount ?? 0,
        totalPrice: sale.totalPrice,
      }));

    const mostSoldProduct = salesByProduct[0];
    const productsSold = salesByProduct.reduce(
      (acc, product) => acc + (product.amount ?? 0),
      0
    );

    const totalSales = salesByProduct.reduce(
      (acc, product) => acc + (product.totalPrice ?? 0),
      0
    );

    return {
      productsSold,
      numberOfSales,
      totalSales,
      mostSoldProduct,
      salesByProduct,
    };
  }),
});
