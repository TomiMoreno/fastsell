import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "~/lib/schemas/organizations";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { organizationUsersTable, organizationsTable } from "~/server/db/schema";

export const organizationsRouter = createTRPCRouter({
  getMyOrganization: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.organizationsTable.findFirst({
      where: (t, { eq }) => eq(t.id, ctx.session?.organizationId),
    });
  }),
  create: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ ctx, input }) => {
      const [organization] = await ctx.db
        .insert(organizationsTable)
        .values({
          name: input.name,
          logo: input.logo,
        })
        .returning();
      if (!organization) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Organization not created",
        });
      }
      await ctx.db
        .insert(organizationUsersTable)
        .values({
          userId: ctx.session.user.id,
          organizationId: organization.id,
          role: "admin",
        })
        .returning();
    }),
  update: publicProcedure
    .input(updateOrganizationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.organizationId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User has no organization",
        });

      await ctx.db
        .update(organizationsTable)
        .set({
          ...input,
        })
        .where(eq(organizationsTable.id, ctx.session.organizationId))
        .returning();
    }),
});
