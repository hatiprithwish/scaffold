import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { UserRoleEnum } from "@scaffold/schemas";

// DEV_NOTE: SQLite does not have bigInt support

export const users = table(
  "users",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    clerkId: t.text("clerk_id").notNull(),
    email: t.text().notNull(),
    role: t.text().$type<UserRoleEnum>().notNull(),
    createdAt: t.integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    t.uniqueIndex("UNQ_users_clerk_id").on(table.clerkId),
    t.uniqueIndex("UNQ_users_email").on(table.email),
  ],
);
