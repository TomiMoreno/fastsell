import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";

import { generateIdFromEntropySize } from "lucia";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "~/server/auth";
import { db } from "~/server/db";
import {
  organizationUsersTable,
  organizationsTable,
  usersTable,
} from "~/server/db/schema";

export const MINIMUM_HASH_PARAMETERS = {
  // recommended minimum parameters
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
} as const satisfies Parameters<typeof hash>[1];

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        email: z
          .string()
          .email()
          .max(250)
          .refine(
            async (email) => {
              const user = await db.query.usersTable.findFirst({
                where: (t, { eq }) => eq(t.email, email),
              });
              return !user;
            },
            { message: "Email already used" },
          ),
        password: z.string().min(6).max(250),
        name: z.string().max(250),
        lastName: z.string().max(250),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const passwordHash = await hash(input.password, MINIMUM_HASH_PARAMETERS);

      const userId = generateIdFromEntropySize(10); // 16 characters long

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

      if (!user)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      const newOrganization = await ctx.db
        .insert(organizationsTable)
        .values({
          name: "default",
          logo: "",
        })
        .returning()
        .then(([organization]) => organization);
      if (!newOrganization)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create organization",
        });
      await ctx.db.insert(organizationUsersTable).values({
        userId: user.id,
        organizationId: newOrganization.id,
        role: "admin",
      });
      const session = await lucia.createSession(userId, {
        organizationId: newOrganization.id,
      });
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email().max(250),
        password: z.string().min(6).max(250),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.usersTable.findFirst({
        where: (t, { eq }) => eq(t.email, input.email),
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Incorrect email or password",
        });
      }

      const validPassword = await verify(
        existingUser.password,
        input.password,
        MINIMUM_HASH_PARAMETERS,
      );

      if (!validPassword) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Incorrect email or password",
        });
      }

      const userOrganizations =
        await ctx.db.query.organizationUsersTable.findMany({
          where: (t, { eq }) => eq(t.userId, existingUser.id),
        });

      let organizationId = userOrganizations[0]?.organizationId;
      if (!organizationId) {
        const newOrganization = await ctx.db
          .insert(organizationsTable)
          .values({
            name: "default",
            logo: "",
          })
          .returning()
          .then(([organization]) => organization);
        if (!newOrganization)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create organization",
          });
        await ctx.db.insert(organizationUsersTable).values({
          userId: existingUser.id,
          organizationId: newOrganization.id,
          role: "admin",
        });
        organizationId = newOrganization.id;
      }

      const session = await lucia.createSession(existingUser.id, {
        organizationId,
      });
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return;
    }),
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    await lucia.invalidateSession(ctx.session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }),
  me: publicProcedure.query(async ({ ctx: { session, db } }) => {
    if (!session) return null;
    const user = await db.query.usersTable.findFirst({
      extras: {
        fullName:
          sql<string>`${usersTable.name} || ' ' || ${usersTable.lastName}`.as(
            "fullName",
          ),
      },
      columns: {
        password: false,
      },
      where: (t, { eq }) => eq(t.id, session.userId),
    });

    const currentOrganization = await db.query.organizationsTable.findFirst({
      where: (t, { eq }) => eq(t.id, session.organizationId),
    });

    if (!user || !currentOrganization) {
      return null;
    }

    return { user, organization: currentOrganization };
  }),
});
