alter table "public"."events" drop column "location";

alter table "public"."events" add column "venue" uuid;

alter table "public"."venues" alter column "created_by" set data type uuid using "created_by"::uuid;

alter table "public"."events" add constraint "events_venue_fkey" FOREIGN KEY (venue) REFERENCES venues(id) not valid;

alter table "public"."events" validate constraint "events_venue_fkey";

alter table "public"."venues" add constraint "venues_created_by_fkey" FOREIGN KEY (created_by) REFERENCES user_profiles(id) not valid;

alter table "public"."venues" validate constraint "venues_created_by_fkey";


