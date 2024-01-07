create type "public"."message_status" as enum ('read', 'unread', 'deleted');

create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "from" uuid,
    "to" uuid,
    "message" text not null,
    "status" message_status not null default 'unread'::message_status
);


CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."messages" add constraint "messages_from_fkey" FOREIGN KEY ("from") REFERENCES organizations(id) not valid;

alter table "public"."messages" validate constraint "messages_from_fkey";

alter table "public"."messages" add constraint "messages_to_fkey" FOREIGN KEY ("to") REFERENCES user_profiles(id) not valid;

alter table "public"."messages" validate constraint "messages_to_fkey";


