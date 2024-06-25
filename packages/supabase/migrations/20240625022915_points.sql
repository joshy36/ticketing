create table "public"."artist_points" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "artist_id" uuid,
    "user_id" uuid,
    "points" bigint default '0'::bigint
);


create table "public"."platform_points" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid,
    "points" bigint default '0'::bigint
);


create table "public"."venue_points" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "venue_id" uuid,
    "user_id" uuid,
    "points" bigint default '0'::bigint
);


CREATE UNIQUE INDEX artist_points_pkey ON public.artist_points USING btree (id);

CREATE UNIQUE INDEX platform_points_pkey ON public.platform_points USING btree (id);

CREATE UNIQUE INDEX venue_points_pkey ON public.venue_points USING btree (id);

alter table "public"."artist_points" add constraint "artist_points_pkey" PRIMARY KEY using index "artist_points_pkey";

alter table "public"."platform_points" add constraint "platform_points_pkey" PRIMARY KEY using index "platform_points_pkey";

alter table "public"."venue_points" add constraint "venue_points_pkey" PRIMARY KEY using index "venue_points_pkey";

alter table "public"."artist_points" add constraint "artist_points_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."artist_points" validate constraint "artist_points_artist_id_fkey";

alter table "public"."artist_points" add constraint "artist_points_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."artist_points" validate constraint "artist_points_user_id_fkey";

alter table "public"."platform_points" add constraint "platform_points_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."platform_points" validate constraint "platform_points_user_id_fkey";

alter table "public"."venue_points" add constraint "venue_points_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."venue_points" validate constraint "venue_points_user_id_fkey";

alter table "public"."venue_points" add constraint "venue_points_venue_id_fkey" FOREIGN KEY (venue_id) REFERENCES venues(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."venue_points" validate constraint "venue_points_venue_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.artist_points FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.platform_points FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.venue_points FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


