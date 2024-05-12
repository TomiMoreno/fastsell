import { createTRPCRouter, devProcedure } from "~/server/api/trpc";

import { seed, unSeed } from "~/server/db/seed";

export const seedRouter = createTRPCRouter({
  addRandomData: devProcedure.mutation(() => {
    return seed();
  }),
  clearCurrentData: devProcedure.mutation(async () => {
    return unSeed();
  }),
});
