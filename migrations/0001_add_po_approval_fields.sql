ALTER TABLE "purchase_orders" ADD COLUMN "submitted_by_id" integer;
ALTER TABLE "purchase_orders" ADD COLUMN "submitted_at" timestamp;
ALTER TABLE "purchase_orders" ADD COLUMN "approved_by_id" integer;
ALTER TABLE "purchase_orders" ADD COLUMN "approved_at" timestamp;
ALTER TABLE "purchase_orders" ADD COLUMN "rejection_reason" text;
ALTER TABLE "purchase_orders" ADD COLUMN "converted_invoice_id" integer;
DO $$ BEGIN
 ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
