create table "public"."scanners" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid not null,
    "event_id" uuid not null
);


alter table "public"."tickets" add column "section_id" uuid;

alter table "public"."tickets" add column "updated_at" timestamp with time zone default now();

CREATE UNIQUE INDEX scanners_pkey ON public.scanners USING btree (id);

alter table "public"."scanners" add constraint "scanners_pkey" PRIMARY KEY using index "scanners_pkey";

alter table "public"."scanners" add constraint "scanners_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) not valid;

alter table "public"."scanners" validate constraint "scanners_event_id_fkey";

alter table "public"."scanners" add constraint "scanners_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) not valid;

alter table "public"."scanners" validate constraint "scanners_user_id_fkey";

alter table "public"."tickets" add constraint "tickets_section_id_fkey" FOREIGN KEY (section_id) REFERENCES sections(id) not valid;

alter table "public"."tickets" validate constraint "tickets_section_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.scanners FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


