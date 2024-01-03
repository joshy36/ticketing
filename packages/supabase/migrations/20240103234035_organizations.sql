create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text
);


alter table "public"."user_profiles" add column "organization_id" uuid;

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_organization_id_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


