create table "public"."user_salts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "user_id" uuid,
    "salt" text
);


alter table "public"."user_salts" enable row level security;

CREATE UNIQUE INDEX user_salts_pkey ON public.user_salts USING btree (id);

alter table "public"."user_salts" add constraint "user_salts_pkey" PRIMARY KEY using index "user_salts_pkey";

alter table "public"."user_salts" add constraint "user_salts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_salts" validate constraint "user_salts_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_salt()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ 
DECLARE random_salt TEXT; BEGIN 
-- Generate a random string using MD5 
random_salt := md5(random()::text || current_timestamp::text); 
-- Insert the random string as the salt 
INSERT INTO public.user_salts (user_id, salt) 
VALUES (NEW.id, random_salt); 
RETURN NEW; 
END; 
$function$
;

CREATE TRIGGER on_user_profile_created_salt AFTER INSERT ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION handle_new_user_salt();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_salts FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


