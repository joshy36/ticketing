alter table "public"."tickets" drop constraint "tickets_qr_code_key";

drop index if exists "public"."tickets_qr_code_key";

alter table "public"."tickets" drop column "qr_code";

alter table "public"."tickets" add column "current_wallet_address" text;

alter table "public"."user_salts" disable row level security;


