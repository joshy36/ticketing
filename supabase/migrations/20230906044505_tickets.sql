create table "public"."tickets" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "event_id" uuid not null,
    "user_id" uuid,
    "price" double precision not null,
    "seat" text not null default 'GA'::text
);


alter table "public"."events" add column "number_of_tickets" bigint default '0'::bigint;

alter table "public"."events" add column "tickets_remaining" bigint;

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

alter table "public"."tickets" add constraint "tickets_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) not valid;

alter table "public"."tickets" validate constraint "tickets_event_id_fkey";

alter table "public"."tickets" add constraint "tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) not valid;

alter table "public"."tickets" validate constraint "tickets_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment(table_name text, row_id text, x integer, field_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
   EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', table_name, field_name, field_name)
   USING x, uuid(row_id);
END
$function$
;


