alter table "public"."user_profiles" add column "bio" text;

alter table "public"."user_profiles" disable row level security;

CREATE UNIQUE INDEX user_profiles_username_key ON public.user_profiles USING btree (username);

alter table "public"."user_profiles" add constraint "user_profiles_username_key" UNIQUE using index "user_profiles_username_key";


