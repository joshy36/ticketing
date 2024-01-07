create type "public"."role" as enum ('owner', 'admin');

alter table "public"."user_profiles" drop constraint "user_profiles_organization_id_fkey";

create table "public"."organization_members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "organization_id" uuid,
    "user_id" uuid,
    "role" role
);


alter table "public"."user_profiles" drop column "organization_id";

CREATE UNIQUE INDEX org_members_pkey ON public.organization_members USING btree (id);

alter table "public"."organization_members" add constraint "org_members_pkey" PRIMARY KEY using index "org_members_pkey";

alter table "public"."organization_members" add constraint "organization_members_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_user_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


