create table "public"."user_profiles" (
    "id" uuid not null,
    "first_name" text,
    "last_name" text,
    "username" text,
    "profile_image" text
);


alter table "public"."user_profiles" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.user_profiles USING btree (id);

alter table "public"."user_profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.user_profiles (id)
  values (new.id);
  return new;
end;
$function$
;

create policy "Public profiles are viewable by everyone."
on "public"."user_profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."user_profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."user_profiles"
as permissive
for update
to public
using ((auth.uid() = id));



