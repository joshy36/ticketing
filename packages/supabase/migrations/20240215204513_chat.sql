create type "public"."chat_type" as enum ('group', 'dm');

create type "public"."group_type" as enum ('group', 'dm');

create table "public"."chat_members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "chat_id" uuid not null
);


create table "public"."chat_messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "content" text,
    "from" uuid,
    "chat_id" uuid not null
);


create table "public"."chats" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text,
    "chat_type" chat_type not null
);


CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id);

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX user_chats_pkey ON public.chat_members USING btree (id);

alter table "public"."chat_members" add constraint "user_chats_pkey" PRIMARY KEY using index "user_chats_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_pkey" PRIMARY KEY using index "chat_messages_pkey";

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."chat_members" add constraint "chat_members_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chat_members" validate constraint "chat_members_chat_id_fkey";

alter table "public"."chat_members" add constraint "chat_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chat_members" validate constraint "chat_members_user_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_chat_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_from_fkey" FOREIGN KEY ("from") REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_from_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.chat_messages FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.chats FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


