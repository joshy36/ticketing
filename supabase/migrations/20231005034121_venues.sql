create table "public"."venues" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" text not null,
    "name" text not null,
    "description" text not null,
    "image" text,
    "id" uuid not null default gen_random_uuid()
);


CREATE UNIQUE INDEX venues_name_key ON public.venues USING btree (name);

CREATE UNIQUE INDEX venues_pkey ON public.venues USING btree (id);

alter table "public"."venues" add constraint "venues_pkey" PRIMARY KEY using index "venues_pkey";

alter table "public"."venues" add constraint "venues_name_key" UNIQUE using index "venues_name_key";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


