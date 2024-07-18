import { format } from "date-fns";
import { and, count, eq, gte, inArray, lte, sql, sum } from "drizzle-orm";
import { createSaleSchema, dashboardSchema } from "~/lib/schemas/product";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  productSalesTable,
  productsTable,
  salesTable,
} from "~/server/db/schema";

export const saleRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(salesTable).all();
  }),
  create: protectedProcedure
    .input(createSaleSchema)
    .mutation(async ({ ctx, input }) => {
      // First we create a sale to store ProductSales in it.
      const sale = await ctx.db
        .insert(salesTable)
        .values({ total: 0, organizationId: ctx.session.organizationId })
        .returning()
        .then((res) => res.at(0));
      if (!sale) throw new Error("Sale not created");
      const productsIds = [...input.productMap.keys()];
      const products = await ctx.db.query.productsTable.findMany({
        where: ({ id }, { inArray }) => inArray(id, productsIds),
      });
      const productsMap = products.reduce(
        (acc, product) => {
          acc[product.id] = product;
          return acc;
        },
        {} as Record<string, (typeof products)[0]>,
      );
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
  dashboard: protectedProcedure
    .input(dashboardSchema)
    .query(async ({ ctx, input }) => {
      const allProducts = await ctx.db.query.productsTable.findMany({
        where: (t, { eq }) => eq(t.organizationId, ctx.session.organizationId),
      });
      const productMap = new Map(
        allProducts.map((product) => [product.id, product]),
      );
      const salesByProductAndPrice = await ctx.db
        .select({
          amount: sum(productSalesTable.amount).mapWith(Number),
          price: productSalesTable.price,
          productId: productSalesTable.productId,
          createdAt: productSalesTable.createdAt,
        })
        .from(productSalesTable)
        .groupBy(productSalesTable.productId, productSalesTable.price)
        .where(({ productId, createdAt }) =>
          and(
            inArray(productId, [...allProducts.map((p) => p.id)]),
            gte(
              createdAt,
              sql`${format(input.dateRange?.from ?? new Date(0), "yyyy-MM-dd")}`,
            ),
            input.dateRange.to &&
              lte(
                createdAt,
                sql`${format(input.dateRange.to, "yyyy-MM-dd HH:mm:ss")}`,
              ),
          ),
        );

      const { numberOfSales } = (await ctx.db
        .select({
          total: sum(salesTable.total).mapWith(Number),
          numberOfSales: count(),
          organizationId: salesTable.organizationId,
          createdAt: salesTable.createdAt,
        })
        .from(salesTable)
        .where((t) =>
          and(
            eq(t.organizationId, ctx.session.organizationId),
            gte(
              t.createdAt,
              sql`${format(input.dateRange?.from ?? new Date(0), "yyyy-MM-dd")}`,
            ),
            input.dateRange.to &&
              lte(
                t.createdAt,
                sql`${format(input.dateRange.to, "yyyy-MM-dd HH:mm:ss")}`,
              ),
          ),
        )
        .then((res) => res.at(0))) ?? { total: 0, numberOfSales: 0 };

      const salesByProductWithTotalPrice = salesByProductAndPrice.map(
        (sale) => ({
          ...sale,
          totalPrice: (sale.amount ?? 0) * sale.price,
          amount: sale.amount ?? 0,
          product: productMap.get(sale.productId),
        }),
      );

      const salesByProduct = salesByProductWithTotalPrice
        .reduce(
          (acc, sale) => {
            const product = acc.find((p) => p.productId === sale.productId);
            if (product) {
              product.amount += sale.amount ?? 0;
              product.totalPrice += sale.totalPrice;
            } else {
              acc.push(sale);
            }
            return acc;
          },
          [] as typeof salesByProductWithTotalPrice,
        )
        .sort((a, b) => b.totalPrice - a.totalPrice)
        .map((sale) => ({
          ...sale.product,
          productId: sale.productId,
          amount: sale.amount ?? 0,
          totalPrice: sale.totalPrice,
        }));

      const mostSoldProduct = salesByProduct.reduce((acc, product) =>
        acc.amount > product.amount ? acc : product,
      );
      const productsSold = salesByProduct.reduce(
        (acc, product) => acc + (product.amount ?? 0),
        0,
      );

      const totalSales = salesByProduct.reduce(
        (acc, product) => acc + (product.totalPrice ?? 0),
        0,
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
