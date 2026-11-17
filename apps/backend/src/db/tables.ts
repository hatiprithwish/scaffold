import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import type * as Schemas from "@app/schemas";

export const users = table(
  "users",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    publicId: t.text("public_id").notNull(),
    clerkId: t.text("clerk_id").notNull(),
    email: t.text().notNull(),
    role: t.text().$type<Schemas.UserRoleEnum>().notNull(),
    createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
    updatedAt: t.timestamp("updated_at", { mode: "date", withTimezone: true }).notNull(),
  },
  (table) => [
    t.uniqueIndex("UNQ_users_public_id").on(table.publicId),
    t.uniqueIndex("UNQ_users_clerk_id").on(table.clerkId),
    t.uniqueIndex("UNQ_users_email").on(table.email),
  ],
);

export const notes = table(
  "notes",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    publicId: t.text("public_id").notNull(),
    userId: t.text("user_id").notNull(),
    title: t.text().notNull(),
    body: t.text(),
    status: t.integer().$type<Schemas.NoteStatusIntEnum>().notNull().default(1), // NoteStatusIntEnum.Draft
    createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
    updatedAt: t.timestamp("updated_at", { mode: "date", withTimezone: true }),
  },
  (table) => [
    t.uniqueIndex("UNQ_notes_public_id").on(table.publicId),
    t.index("IDX_notes_user_id").on(table.userId),
  ],
);
