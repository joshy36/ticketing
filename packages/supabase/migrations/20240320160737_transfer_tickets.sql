alter table "public"."tickets" drop constraint "tickets_user_id_fkey";

alter table "public"."tickets" drop column "user_id";

alter table "public"."tickets" add column "owner_id" uuid;

alter table "public"."tickets" add column "purchaser_id" uuid;

alter table "public"."tickets" add constraint "tickets_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."tickets" validate constraint "tickets_owner_id_fkey";

alter table "public"."tickets" add constraint "tickets_purchaser_id_fkey" FOREIGN KEY (purchaser_id) REFERENCES user_profiles(id) not valid;

alter table "public"."tickets" validate constraint "tickets_purchaser_id_fkey";


