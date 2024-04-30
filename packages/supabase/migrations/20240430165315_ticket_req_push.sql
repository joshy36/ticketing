create table "public"."ticket_transfer_push_request" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "from" uuid,
    "to" uuid,
    "ticket_id" uuid,
    "status" friend_request_status default 'pending'::friend_request_status
);


CREATE UNIQUE INDEX ticket_transfer_push_request_pkey ON public.ticket_transfer_push_request USING btree (id);

alter table "public"."ticket_transfer_push_request" add constraint "ticket_transfer_push_request_pkey" PRIMARY KEY using index "ticket_transfer_push_request_pkey";

alter table "public"."ticket_transfer_push_request" add constraint "ticket_transfer_push_request_from_fkey" FOREIGN KEY ("from") REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_transfer_push_request" validate constraint "ticket_transfer_push_request_from_fkey";

alter table "public"."ticket_transfer_push_request" add constraint "ticket_transfer_push_request_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_transfer_push_request" validate constraint "ticket_transfer_push_request_ticket_id_fkey";

alter table "public"."ticket_transfer_push_request" add constraint "ticket_transfer_push_request_to_fkey" FOREIGN KEY ("to") REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_transfer_push_request" validate constraint "ticket_transfer_push_request_to_fkey";


