create type "public"."friend_request_status" as enum ('pending', 'accepted', 'rejected');

create table "public"."friend_requests" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "from" uuid not null,
    "to" uuid not null,
    "status" friend_request_status not null default 'pending'::friend_request_status
);


create table "public"."friends" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user1_id" uuid not null,
    "user2_id" uuid not null
);


alter table "public"."user_profiles" add column "eoa_address" text;

CREATE UNIQUE INDEX friend_requests_pkey ON public.friend_requests USING btree (id);

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (id);

alter table "public"."friend_requests" add constraint "friend_requests_pkey" PRIMARY KEY using index "friend_requests_pkey";

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."friend_requests" add constraint "friend_requests_from_fkey" FOREIGN KEY ("from") REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_from_fkey";

alter table "public"."friend_requests" add constraint "friend_requests_to_fkey" FOREIGN KEY ("to") REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_to_fkey";

alter table "public"."friends" add constraint "friends_user1_id_fkey" FOREIGN KEY (user1_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_user1_id_fkey";

alter table "public"."friends" add constraint "friends_user2_id_fkey" FOREIGN KEY (user2_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_user2_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.friend_requests FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.friends FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


