alter table "public"."chat_members" add column "last_read" uuid;

alter table "public"."chat_members" add constraint "chat_members_last_read_fkey" FOREIGN KEY (last_read) REFERENCES chat_messages(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_members" validate constraint "chat_members_last_read_fkey";


