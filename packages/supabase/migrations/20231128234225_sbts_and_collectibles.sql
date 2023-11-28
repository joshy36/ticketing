create table "public"."collectibles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid,
    "event_id" uuid,
    "ipfs_image" text,
    "base_url" text,
    "etherscan_link" text,
    "ticket_id" uuid
);


create table "public"."sbts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid,
    "event_id" uuid,
    "ipfs_image" text,
    "base_url" text,
    "etherscan_link" text,
    "ticket_id" uuid
);


CREATE UNIQUE INDEX collectibles_pkey ON public.collectibles USING btree (id);

CREATE UNIQUE INDEX sbts_pkey ON public.sbts USING btree (id);

alter table "public"."collectibles" add constraint "collectibles_pkey" PRIMARY KEY using index "collectibles_pkey";

alter table "public"."sbts" add constraint "sbts_pkey" PRIMARY KEY using index "sbts_pkey";

alter table "public"."collectibles" add constraint "collectibles_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) not valid;

alter table "public"."collectibles" validate constraint "collectibles_event_id_fkey";

alter table "public"."collectibles" add constraint "collectibles_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) not valid;

alter table "public"."collectibles" validate constraint "collectibles_ticket_id_fkey";

alter table "public"."collectibles" add constraint "collectibles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) not valid;

alter table "public"."collectibles" validate constraint "collectibles_user_id_fkey";

alter table "public"."sbts" add constraint "sbts_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) not valid;

alter table "public"."sbts" validate constraint "sbts_event_id_fkey";

alter table "public"."sbts" add constraint "sbts_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) not valid;

alter table "public"."sbts" validate constraint "sbts_ticket_id_fkey";

alter table "public"."sbts" add constraint "sbts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) not valid;

alter table "public"."sbts" validate constraint "sbts_user_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.collectibles FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.sbts FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


