alter table "public"."chat_messages" drop constraint "chat_messages_from_fkey";

alter type "public"."chat_type" rename to "chat_type__old_version_to_be_dropped";

create type "public"."chat_type" as enum ('group', 'dm', 'organization');

alter table "public"."chats" alter column chat_type type "public"."chat_type" using chat_type::text::"public"."chat_type";

drop type "public"."chat_type__old_version_to_be_dropped";

alter table "public"."chat_member_messages" add column "chat_id" uuid;

alter table "public"."chat_members" add column "artist_id" uuid;

alter table "public"."chat_members" add column "venue_id" uuid;

alter table "public"."chat_members" alter column "user_id" drop not null;

alter table "public"."chat_messages" add column "event_id" uuid;

alter table "public"."chat_member_messages" add constraint "chat_member_messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chat_member_messages" validate constraint "chat_member_messages_chat_id_fkey";

alter table "public"."chat_members" add constraint "chat_members_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_members" validate constraint "chat_members_artist_id_fkey";

alter table "public"."chat_members" add constraint "chat_members_venue_id_fkey" FOREIGN KEY (venue_id) REFERENCES venues(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_members" validate constraint "chat_members_venue_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_event_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_from_fkey" FOREIGN KEY ("from") REFERENCES chat_members(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_from_fkey";


