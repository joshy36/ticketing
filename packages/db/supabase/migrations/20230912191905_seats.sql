alter table "public"."events" drop column "number_of_tickets";

alter table "public"."events" add column "ga_price" double precision;

alter table "public"."events" add column "ga_tickets" bigint default '0'::bigint;

alter table "public"."events" add column "rows" bigint;

alter table "public"."events" add column "seats_per_row" bigint;


