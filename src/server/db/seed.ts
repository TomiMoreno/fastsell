import { faker } from "@faker-js/faker";
import { db } from ".";
import {
  productSalesTable,
  productsTable,
  salesTable,
  usersTable,
} from "./schema";
import { eq } from "drizzle-orm";

const seedProduts = (amount = 35) => {
  const data = new Map<string, typeof productsTable.$inferInsert>(
    new Array(amount).fill(0).map(() => {
      const name = faker.commerce.product();
      return [
        name,
        {
          name,
          image: faker.image.urlLoremFlickr({ category: name }),
          price: faker.number.float({ min: 500, max: 5000, fractionDigits: 2 }),
          stock: faker.number.int({ min: -5, max: 565 }),
        },
      ];
    }),
  );

  return db
    .insert(productsTable)
    .values([...data.values()])
    .returning();
};

const randomSubset = <T>(arr: T[]) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, faker.number.int({ min: 1, max: arr.length - 1 }));
};

const seedSales = async (
  products: (typeof productsTable.$inferSelect)[],
  config: Parameters<typeof faker.number.int>[0] = { min: 50, max: 75 },
) => {
  return db.transaction(async (tx) => {
    const sales = await tx
      .insert(salesTable)
      .values(
        new Array(faker.number.int(config)).fill(0).map(() => ({ total: 0 })),
      )
      .returning({ id: salesTable.id });
    await Promise.all(
      sales.map((sale) => {
        const subset = randomSubset(products);
        const data = subset.map<typeof productSalesTable.$inferInsert>((p) => ({
          saleId: sale.id,
          productId: p.id,
          price: p.price,
          amount: faker.number.int({ min: 1, max: 10 }),
        }));
        const total = data.reduce(
          (prev, curr) => prev + curr.amount * curr.price,
          0,
        );

        return Promise.all([
          tx.insert(productSalesTable).values(data),
          tx
            .update(salesTable)
            .set({ total })
            .where(eq(salesTable.id, sale.id)),
        ]);
      }),
    );
  });
};

const seedUsers = () => {
  const emails = new Set(
    new Array(25).fill(0).map(() => faker.internet.email()),
  );

  return db.insert(usersTable).values(
    [...emails].map((email) => ({
      email,
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    })),
  );
};

export const unSeed = async () => {
  await db.transaction(async (tx) => {
    await tx.delete(productSalesTable);
    await tx.delete(salesTable);
    await tx.delete(productsTable);
  });
};

export const seed = async () => {
  await seedUsers();
  const products = await seedProduts(40);
  await seedSales(products, { min: 50, max: 100 });
};
