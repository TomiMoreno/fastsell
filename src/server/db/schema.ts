import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  customType,
  integer,
  real,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `fastsell_${name}`);

const customTimestamp = customType<{
  data: Date;
  driverData: string;
  config: { fsp: number };
}>({
  dataType() {
    return `timestamp`;
  },
  fromDriver(value: string): Date {
    return new Date(value);
  },
});

export const productsTable = createTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: customTimestamp("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: customTimestamp("updatedAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
  name: text("name").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull(),
  image: text("image").notNull(),
  hotkey: text("hotkey"),
});

export const salesTable = createTable("sales", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: customTimestamp("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: customTimestamp("updatedAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
  total: real("total").notNull(),
});

export const productSalesTable = createTable("product_sales", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: customTimestamp("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: customTimestamp("updatedAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
  price: real("price").notNull(),
  amount: integer("amount").notNull(),
  productId: text("product_id")
    .references(() => productsTable.id)
    .notNull(),
  saleId: text("sale_id")
    .references(() => salesTable.id)
    .notNull(),
});

export const usersTable = createTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: customTimestamp("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: customTimestamp("updatedAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
});

export const sessionsTable = createTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export const productSalesRelations = relations(
  productSalesTable,
  ({ one }) => ({
    sale: one(salesTable, {
      fields: [productSalesTable.saleId],
      references: [salesTable.id],
    }),
    product: one(productsTable, {
      fields: [productSalesTable.productId],
      references: [productsTable.id],
    }),
  }),
);

export const salesRelations = relations(salesTable, ({ many }) => ({
  productSales: many(productSalesTable),
}));

export const productsRelations = relations(productsTable, ({ many }) => ({
  productSales: many(productSalesTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}));
