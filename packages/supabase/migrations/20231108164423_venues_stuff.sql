alter table "public"."events" add column "stripe_product_id" text;

alter table "public"."tickets" add column "stripe_price_id" text;

CREATE UNIQUE INDEX events_stripe_product_id_key ON public.events USING btree (stripe_product_id);

alter table "public"."events" add constraint "events_stripe_product_id_key" UNIQUE using index "events_stripe_product_id_key";


