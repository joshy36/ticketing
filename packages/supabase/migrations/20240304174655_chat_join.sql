create table "public"."chat_member_messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "chat_member_id" uuid,
    "chat_message_id" uuid
);

CREATE UNIQUE INDEX chat_member_messages_pkey ON public.chat_member_messages USING btree (id);

alter table "public"."chat_member_messages" add constraint "chat_member_messages_pkey" PRIMARY KEY using index "chat_member_messages_pkey";

alter table "public"."chat_member_messages" add constraint "chat_member_messages_chat_member_id_fkey" FOREIGN KEY (chat_member_id) REFERENCES chat_members(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_member_messages" validate constraint "chat_member_messages_chat_member_id_fkey";

alter table "public"."chat_member_messages" add constraint "chat_member_messages_chat_message_id_fkey" FOREIGN KEY (chat_message_id) REFERENCES chat_messages(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_member_messages" validate constraint "chat_member_messages_chat_message_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_from_fkey" FOREIGN KEY ("from") REFERENCES chat_members(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_from_fkey";


