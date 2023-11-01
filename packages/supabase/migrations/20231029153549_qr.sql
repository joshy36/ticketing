alter table "public"."tickets" add column "qr_code" text;

alter table "public"."tickets" add column "scanned" boolean not null default false;

CREATE UNIQUE INDEX tickets_qr_code_key ON public.tickets USING btree (qr_code);

alter table "public"."tickets" add constraint "tickets_qr_code_key" UNIQUE using index "tickets_qr_code_key";


