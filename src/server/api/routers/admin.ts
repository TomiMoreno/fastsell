import { hash } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  organizationsTable,
  organizationUsersTable,
  usersTable,
} from "~/server/db/schema";

export const MINIMUM_HASH_PARAMETERS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
} as const satisfies Parameters<typeof hash>[1];

export const adminRouter = createTRPCRouter({
  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.query.usersTable.findMany({
      extras: {
        fullName:
          sql<string>`${usersTable.name} || ' ' || ${usersTable.lastName}`.as(
            "fullName",
          ),
      },
      columns: {
        password: false,
      },
      with: {
        organizationUsers: {
          with: {
            organization: true,
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      organizations: user.organizationUsers.map((ou) => ({
        id: ou.organization.id,
        name: ou.organization.name,
        role: ou.role,
      })),
    }));
  }),

  getAllOrganizations: adminProcedure.query(async ({ ctx }) => {
    const organizations = await ctx.db.query.organizationsTable.findMany({
      with: {
        organizationUsers: {
          with: {
            user: {
              columns: {
                password: false,
              },
              extras: {
                fullName:
                  sql<string>`${usersTable.name} || ' ' || ${usersTable.lastName}`.as(
                    "fullName",
                  ),
              },
            },
          },
        },
      },
    });

    return organizations.map((org) => ({
      ...org,
      users: org.organizationUsers.map((ou) => ({
        id: ou.user.id,
        name: ou.user.name,
        lastName: ou.user.lastName,
        email: ou.user.email,
        fullName: ou.user.fullName,
        role: ou.role,
      })),
    }));
  }),

  createUser: adminProcedure
    .input(
      z.object({
        email: z.string().email().max(250),
        password: z.string().min(6).max(250),
        name: z.string().max(250),
        lastName: z.string().max(250),
        organizationId: z.string(),
        role: z.enum(["admin", "user"]).default("user"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existingUser = await ctx.db.query.usersTable.findFirst({
        where: (t, { eq }) => eq(t.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      const passwordHash = await hash(input.password, MINIMUM_HASH_PARAMETERS);
      const userId = generateIdFromEntropySize(10);

      // Create user
      const user = await ctx.db
        .insert(usersTable)
        .values({
          id: userId,
          name: input.name,
          lastName: input.lastName,
          email: input.email,
          password: passwordHash,
        })
        .returning()
        .then(([user]) => user);

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      // Add user to organization
      await ctx.db.insert(organizationUsersTable).values({
        userId: user.id,
        organizationId: input.organizationId,
        role: input.role,
      });

      return user;
    }),

  createOrganization: adminProcedure
    .input(
      z.object({
        name: z.string().max(250),
        logo: z.string().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db
        .insert(organizationsTable)
        .values({
          name: input.name,
          logo: input.logo,
        })
        .returning()
        .then(([org]) => org);

      if (!organization) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create organization",
        });
      }

      return organization;
    }),

  updateUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().max(250),
        lastName: z.string().max(250),
        email: z.string().email().max(250),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists for a different user
      const existingUser = await ctx.db.query.usersTable.findFirst({
        where: (t, { and, eq, ne }) =>
          and(eq(t.email, input.email), ne(t.id, input.userId)),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      await ctx.db
        .update(usersTable)
        .set({
          name: input.name,
          lastName: input.lastName,
          email: input.email,
          updatedAt: new Date(),
        })
        .where(sql`${usersTable.id} = ${input.userId}`);
    }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        organizationId: z.string(),
        role: z.enum(["admin", "user"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(organizationUsersTable)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(
          sql`${organizationUsersTable.userId} = ${input.userId} AND ${organizationUsersTable.organizationId} = ${input.organizationId}`,
        );
    }),

  removeUserFromOrganization: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        organizationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(organizationUsersTable)
        .where(
          sql`${organizationUsersTable.userId} = ${input.userId} AND ${organizationUsersTable.organizationId} = ${input.organizationId}`,
        );
    }),

  addUserToOrganization: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        organizationId: z.string(),
        role: z.enum(["admin", "user"]).default("user"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(organizationUsersTable).values({
        userId: input.userId,
        organizationId: input.organizationId,
        role: input.role,
      });
    }),

  addExistingUserToOrganization: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        organizationId: z.string(),
        role: z.enum(["admin", "user"]).default("user"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is already in this organization
      const existingMembership =
        await ctx.db.query.organizationUsersTable.findFirst({
          where: (t, { and, eq }) =>
            and(
              eq(t.userId, input.userId),
              eq(t.organizationId, input.organizationId),
            ),
        });

      if (existingMembership) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a member of this organization",
        });
      }

      await ctx.db.insert(organizationUsersTable).values({
        userId: input.userId,
        organizationId: input.organizationId,
        role: input.role,
      });
    }),
});
