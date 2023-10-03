create table "public"."artists" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid not null,
    "name" text not null,
    "description" text not null,
    "image" text
);


alter table "public"."events" add column "artist" uuid;

CREATE UNIQUE INDEX artists_name_key ON public.artists USING btree (name);

CREATE UNIQUE INDEX artists_pkey ON public.artists USING btree (id);

alter table "public"."artists" add constraint "artists_pkey" PRIMARY KEY using index "artists_pkey";

alter table "public"."artists" add constraint "artists_created_by_fkey" FOREIGN KEY (created_by) REFERENCES user_profiles(id) not valid;

alter table "public"."artists" validate constraint "artists_created_by_fkey";

alter table "public"."artists" add constraint "artists_name_key" UNIQUE using index "artists_name_key";

alter table "public"."events" add constraint "events_artist_fkey" FOREIGN KEY (artist) REFERENCES artists(id) not valid;

alter table "public"."events" validate constraint "events_artist_fkey";


