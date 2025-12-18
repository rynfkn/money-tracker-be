import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("User", {
  userId: uuid("userId").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false, precision: 0 })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("Categories", {
  categoryId: uuid("categoryId").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
});

export const wallets = pgTable("wallets", {
  walletId: uuid("walletId").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  walletName: varchar("walletName", { length: 255 }).notNull(),
  balance: numeric("balance", { precision: 19, scale: 4 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false, precision: 0 })
    .notNull()
    .defaultNow(),
});

export const transactions = pgTable("transactions", {
  transactionId: uuid("transactionId").primaryKey().defaultRandom(),
  walletId: uuid("walletId")
    .notNull()
    .references(() => wallets.walletId, { onDelete: "cascade" }),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => categories.categoryId, { onDelete: "restrict" }),
  transactionDate: timestamp("transaction_date", { withTimezone: false })
    .notNull(),
  amount: numeric("amount", { precision: 19, scale: 4 }).notNull(),
  description: text("description").notNull(),
  transactionType: varchar("transactionType", { length: 255 }).notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  wallets: many(wallets),
}));

export const walletRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, { fields: [wallets.userId], references: [users.userId] }),
  transactions: many(transactions),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.userId] }),
  transactions: many(transactions),
}));

export const transactionRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.walletId],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.categoryId],
  }),
}));
