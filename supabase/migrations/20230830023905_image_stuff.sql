alter table "public"."events" alter column "image" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.user_profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$function$
;


