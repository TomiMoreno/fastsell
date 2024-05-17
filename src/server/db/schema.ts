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
  organizationId: text("organization_id")
    .references(() => organizationsTable.id)
    .notNull(),
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
  organizationId: text("organization_id")
    .references(() => organizationsTable.id)
    .notNull(),
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
  organizationId: text("organization_id").references(
    () => organizationsTable.id,
    {
      onDelete: "cascade",
    },
  ),
});

export const organizationsTable = createTable("organizations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  createdAt: customTimestamp("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: customTimestamp("updatedAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
});

export const organizationUsersTable = createTable("organization_users", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: customTimestamp("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: customTimestamp("updatedAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
});

export const organizationsRelations = relations(
  organizationsTable,
  ({ many }) => ({
    organizationUsers: many(organizationUsersTable),
    sessions: many(sessionsTable),
  }),
);

export const organizationUsersRelations = relations(
  organizationUsersTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [organizationUsersTable.userId],
      references: [usersTable.id],
    }),
    organization: one(organizationsTable, {
      fields: [organizationUsersTable.organizationId],
      references: [organizationsTable.id],
    }),
  }),
);

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

export const salesRelations = relations(salesTable, ({ many, one }) => ({
  productSales: many(productSalesTable),
  organization: one(organizationsTable, {
    fields: [salesTable.organizationId],
    references: [organizationsTable.id],
  }),
}));

export const productsRelations = relations(productsTable, ({ many, one }) => ({
  productSales: many(productSalesTable),
  organization: one(organizationsTable, {
    fields: [productsTable.organizationId],
    references: [organizationsTable.id],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [sessionsTable.organizationId],
    references: [organizationsTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
  organizationUsers: many(organizationUsersTable),
}));
