create table "public"."reservations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "ticket_id" uuid,
    "user_id" uuid,
    "expiration" timestamp with time zone,
    "event_id" uuid,
    "section_id" uuid
);


CREATE UNIQUE INDEX reservations_pkey ON public.reservations USING btree (id);

CREATE UNIQUE INDEX reservations_ticket_id_key ON public.reservations USING btree (ticket_id);

alter table "public"."reservations" add constraint "reservations_pkey" PRIMARY KEY using index "reservations_pkey";

alter table "public"."reservations" add constraint "reservations_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reservations" validate constraint "reservations_event_id_fkey";

alter table "public"."reservations" add constraint "reservations_section_id_fkey" FOREIGN KEY (section_id) REFERENCES sections(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reservations" validate constraint "reservations_section_id_fkey";

alter table "public"."reservations" add constraint "reservations_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reservations" validate constraint "reservations_ticket_id_fkey";

alter table "public"."reservations" add constraint "reservations_ticket_id_key" UNIQUE using index "reservations_ticket_id_key";

alter table "public"."reservations" add constraint "reservations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reservations" validate constraint "reservations_user_id_fkey";


