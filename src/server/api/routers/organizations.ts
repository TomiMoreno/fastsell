import { eq } from "drizzle-orm";
import { z } from "zod";
import { createOrganizationSchema } from "~/lib/schemas/organizations";
import { updateProductSchema } from "~/lib/schemas/product";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { organizationsTable, productsTable } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.organizationsTable.findMany({
      with: {
        organizationUsers: {
          where: ({ userId }, { eq }) => eq(userId, ctx.session.user?.id),
        },
      },
    });
  }),
  create: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db
        .insert(organizationsTable)
        .values({
          name: input.name,
          logo: input.logo,
        })
        .returning(),
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
        .returning(),
    ),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(productsTable).where(eq(productsTable.id, input));
  }),
});
