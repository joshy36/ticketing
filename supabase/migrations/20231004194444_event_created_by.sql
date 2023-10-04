alter table "public"."events" add column "created_by" uuid;

alter table "public"."events" add constraint "events_created_by_fkey" FOREIGN KEY (created_by) REFERENCES user_profiles(id) not valid;

alter table "public"."events" validate constraint "events_created_by_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


