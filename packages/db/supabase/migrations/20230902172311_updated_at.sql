create extension if not exists "moddatetime" with schema "extensions";


alter table "public"."user_profiles" add column "created_at" timestamp with time zone default now();

alter table "public"."user_profiles" add column "updated_at" timestamp with time zone;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


