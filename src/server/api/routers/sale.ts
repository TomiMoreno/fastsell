import { format } from "date-fns";
import { and, count, eq, gte, inArray, lte, sql, sum } from "drizzle-orm";
import { z } from "zod";
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

  getTransactions: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        dateRange: z
          .object({
            from: z.date().optional(),
            to: z.date().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const sales = await ctx.db.query.salesTable.findMany({
        where: (t, { and, eq, gte, lte }) => {
          const conditions = [eq(t.organizationId, ctx.session.organizationId)];

          if (input.dateRange?.from) {
            conditions.push(gte(t.createdAt, input.dateRange.from));
          }

          if (input.dateRange?.to) {
            conditions.push(lte(t.createdAt, input.dateRange.to));
          }

          return and(...conditions);
        },
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit: input.limit,
        offset,
        with: {
          productSales: {
            with: {
              product: true,
            },
          },
        },
      });

      // Obtener el total de transacciones para la paginación con filtros de fecha
      const countConditions = [
        eq(salesTable.organizationId, ctx.session.organizationId),
      ];

      if (input.dateRange?.from) {
        countConditions.push(gte(salesTable.createdAt, input.dateRange.from));
      }

      if (input.dateRange?.to) {
        countConditions.push(lte(salesTable.createdAt, input.dateRange.to));
      }

      const totalCount = await ctx.db
        .select({ count: count() })
        .from(salesTable)
        .where(and(...countConditions))
        .then((res) => res[0]?.count ?? 0);

      return {
        sales,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / input.limit),
        },
      };
    }),

  getTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const sale = await ctx.db.query.salesTable.findFirst({
        where: (t, { and, eq }) =>
          and(
            eq(t.id, input.id),
            eq(t.organizationId, ctx.session.organizationId),
          ),
        with: {
          productSales: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!sale) throw new Error("Transaction not found");
      return sale;
    }),

  updateTransaction: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        productSales: z.array(
          z.object({
            id: z.string(),
            amount: z.number().min(1),
            price: z.number().min(0),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sale = await ctx.db.query.salesTable.findFirst({
        where: (t, { and, eq }) =>
          and(
            eq(t.id, input.id),
            eq(t.organizationId, ctx.session.organizationId),
          ),
        with: {
          productSales: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!sale) throw new Error("Transaction not found");

      const newTotal = input.productSales.reduce(
        (acc, ps) => acc + ps.amount * ps.price,
        0,
      );

      for (const productSale of input.productSales) {
        await ctx.db
          .update(productSalesTable)
          .set({
            amount: productSale.amount,
            price: productSale.price,
            updatedAt: new Date(),
          })
          .where(eq(productSalesTable.id, productSale.id));
      }

      // Actualizar el total de la venta
      await ctx.db
        .update(salesTable)
        .set({
          total: newTotal,
          updatedAt: new Date(),
        })
        .where(eq(salesTable.id, input.id));

      return { success: true };
    }),

  // Procedimiento para eliminar una transacción
  deleteTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verificar que la transacción existe y pertenece a la organización
      const sale = await ctx.db.query.salesTable.findFirst({
        where: (t, { and, eq }) =>
          and(
            eq(t.id, input.id),
            eq(t.organizationId, ctx.session.organizationId),
          ),
      });

      if (!sale) throw new Error("Transaction not found");

      // Eliminar primero los productSales asociados
      await ctx.db
        .delete(productSalesTable)
        .where(eq(productSalesTable.saleId, input.id));

      // Luego eliminar la venta
      await ctx.db.delete(salesTable).where(eq(salesTable.id, input.id));

      return { success: true };
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

      const mostSoldProduct = salesByProduct.reduce(
        (acc, product) => (acc.amount > product.amount ? acc : product),
        salesByProduct.at(0) ?? {
          amount: 0,
          totalPrice: 0,
          productId: "",
          product: null,
        },
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
