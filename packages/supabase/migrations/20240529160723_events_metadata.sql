create table "public"."events_metadata" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "sbt_base_url" text,
    "sbt_etherscan_link" text,
    "collectible_base_url" text,
    "collectible_etherscan_link" text,
    "event_id" uuid not null,
    "sbt_ipfs_image" text,
    "collectible_ipfs_image" text
);


alter table "public"."collectibles" drop column "base_url";

alter table "public"."collectibles" drop column "etherscan_link";

alter table "public"."collectibles" drop column "ipfs_image";

alter table "public"."sbts" drop column "base_url";

alter table "public"."sbts" drop column "etherscan_link";

alter table "public"."sbts" drop column "ipfs_image";

CREATE UNIQUE INDEX events_metadata_pkey ON public.events_metadata USING btree (id);

alter table "public"."events_metadata" add constraint "events_metadata_pkey" PRIMARY KEY using index "events_metadata_pkey";

alter table "public"."events_metadata" add constraint "events_metadata_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."events_metadata" validate constraint "events_metadata_event_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.events_metadata FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


