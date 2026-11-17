CREATE TABLE "notes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"status" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "UNQ_notes_public_id" ON "notes" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "IDX_notes_user_id" ON "notes" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "UNQ_users_public_id" ON "users" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX "UNQ_users_clerk_id" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE UNIQUE INDEX "UNQ_users_email" ON "users" USING btree ("email");