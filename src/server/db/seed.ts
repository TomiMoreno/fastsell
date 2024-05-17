import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { db } from ".";
import LocalFileService from "../services/localFileService";
import {
  organizationUsersTable,
  organizationsTable,
  productSalesTable,
  productsTable,
  salesTable,
  usersTable,
} from "./schema";

const MINIMUM_HASH_PARAMETERS = {
  // recommended minimum parameters
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
} as const satisfies Parameters<typeof hash>[1];

const randomSubset = <T>(arr: T[]) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, faker.number.int({ min: 1, max: arr.length - 1 }));
};

const randomElementFromArray = <T>(arr: T[], def: T) => {
  return arr[faker.number.int({ min: 0, max: arr.length - 1 })] ?? def;
};

const seedOrganizations = () => {
  const numberOfOrganizations = 3;
  const organizations = new Array(numberOfOrganizations).fill(0).map(() => ({
    name: faker.company.name(),
    logo: faker.image.urlLoremFlickr({ category: "logo" }),
  }));
  return db
    .insert(organizationsTable)
    .values(organizations)
    .returning()
    .then((organizations = []) => organizations.map((o) => o.id));
};

const seedProduts = ({
  amount = 35,
  organizationsIds,
}: {
  amount?: number;
  organizationsIds: string[];
}) => {
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
          organizationId: randomElementFromArray(organizationsIds, ""),
        },
      ];
    }),
  );

  return db
    .insert(productsTable)
    .values([...data.values()])
    .returning();
};

const seedSales = async ({
  products,
  config,
  organizationsIds,
}: {
  products: (typeof productsTable.$inferSelect)[];
  config?: Parameters<typeof faker.number.int>[0];
  organizationsIds: string[];
}) => {
  return db.transaction(async (tx) => {
    const sales = await tx
      .insert(salesTable)
      .values(
        new Array(faker.number.int(config)).fill(0).map(() => ({
          total: 0,
          organizationId: randomElementFromArray(organizationsIds, ""),
        })),
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

const seedUsers = async ({
  organizationsIds,
}: {
  organizationsIds: string[];
}) => {
  const emails = new Set(
    new Array(25).fill(0).map(() => faker.internet.email()),
  );

  const password = await hash("Admin1234!", MINIMUM_HASH_PARAMETERS);

  const users = await db
    .insert(usersTable)
    .values([
      ...[...emails].map((email) => ({
        email,
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password,
      })),
      {
        email: "tomimoreno03@gmail.com",
        name: "admin",
        lastName: "admin",
        password,
      },
    ])
    .returning();

  await db.insert(organizationUsersTable).values(
    users.map((user) => ({
      userId: user.id,
      organizationId: randomElementFromArray(organizationsIds, ""),
      role: "admin",
    })),
  );
};

export const unSeed = async () => {
  await db.transaction(async (tx) => {
    await tx.delete(productSalesTable);
    await tx.delete(salesTable);
    await tx.delete(productsTable);
    await tx.delete(organizationsTable);
    LocalFileService.clean();
  });
};

export const seed = async () => {
  const organizationsIds = await seedOrganizations();
  await seedUsers({ organizationsIds });
  const products = await seedProduts({ amount: 40, organizationsIds });
  await seedSales({
    products,
    config: { min: 50, max: 100 },
    organizationsIds,
  });
};
