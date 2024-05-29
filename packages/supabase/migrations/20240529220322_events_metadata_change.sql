alter table "public"."collectibles" drop constraint "collectibles_ticket_id_fkey";

alter table "public"."events_metadata" drop constraint "events_metadata_event_id_fkey";

alter table "public"."sbts" drop constraint "sbts_ticket_id_fkey";

alter table "public"."events_metadata" add column "collectibles_released" boolean default false;

alter table "public"."events_metadata" add column "sbts_released" boolean default false;

alter table "public"."events_metadata" alter column "event_id" drop not null;

alter table "public"."collectibles" add constraint "collectibles_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."collectibles" validate constraint "collectibles_ticket_id_fkey";

alter table "public"."events_metadata" add constraint "events_metadata_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."events_metadata" validate constraint "events_metadata_event_id_fkey";

alter table "public"."sbts" add constraint "sbts_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."sbts" validate constraint "sbts_ticket_id_fkey";


