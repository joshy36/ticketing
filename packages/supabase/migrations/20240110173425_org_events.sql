alter table "public"."scanners" drop constraint "scanners_event_id_fkey";

alter table "public"."artists" add column "organization_id" uuid;

alter table "public"."events" add column "organization_id" uuid;

alter table "public"."venues" add column "organization_id" uuid;

alter table "public"."artists" add constraint "artists_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."artists" validate constraint "artists_organization_id_fkey";

alter table "public"."events" add constraint "events_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."events" validate constraint "events_organization_id_fkey";

alter table "public"."venues" add constraint "venues_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."venues" validate constraint "venues_organization_id_fkey";

alter table "public"."scanners" add constraint "scanners_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."scanners" validate constraint "scanners_event_id_fkey";


