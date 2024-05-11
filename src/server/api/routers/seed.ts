import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { env } from "process";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { seed } from "~/server/db/seed";

export const seedRouter = createTRPCRouter({
  addRandomData: publicProcedure.mutation(() => {
    if (env.NODE_ENV === "production")
      throw new TRPCError({ code: "BAD_REQUEST" });
    return seed();
  }),
  clearCurrentData: publicProcedure.mutation(async ({ ctx }) => {
    if (env.NODE_ENV === "production")
      throw new TRPCError({ code: "BAD_REQUEST" });

    await ctx.db.transaction(async (tx) => {
      const tables = await tx
        .select({ name: sql`name`.mapWith(String) })
        .from(sql`sqlite_master`)
        .where(sql`type = 'table' AND name like 'fastsell_%'`);
      await Promise.all(
        tables.map(({ name }) => tx.run(sql.raw(`delete from ${name}`))),
      );
    });
  }),
});
