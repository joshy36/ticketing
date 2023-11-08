create table "public"."rows" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text,
    "section_id" uuid,
    "number_of_seats" bigint
);


create table "public"."sections" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text,
    "venue_id" uuid,
    "id" uuid not null default gen_random_uuid(),
    "seats_per_row" bigint,
    "number_of_rows" bigint
);


alter table "public"."events" drop column "ga_price";

alter table "public"."events" drop column "ga_tickets";

alter table "public"."events" drop column "rows";

alter table "public"."events" drop column "seats_per_row";

alter table "public"."events" add column "max_tickets_per_user" bigint;

CREATE UNIQUE INDEX rows_pkey ON public.rows USING btree (id);

CREATE UNIQUE INDEX sections_pkey ON public.sections USING btree (id);

alter table "public"."rows" add constraint "rows_pkey" PRIMARY KEY using index "rows_pkey";

alter table "public"."sections" add constraint "sections_pkey" PRIMARY KEY using index "sections_pkey";

alter table "public"."rows" add constraint "rows_section_id_fkey" FOREIGN KEY (section_id) REFERENCES sections(id) not valid;

alter table "public"."rows" validate constraint "rows_section_id_fkey";

alter table "public"."sections" add constraint "sections_venue_id_fkey" FOREIGN KEY (venue_id) REFERENCES venues(id) not valid;

alter table "public"."sections" validate constraint "sections_venue_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


