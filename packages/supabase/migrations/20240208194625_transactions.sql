create table "public"."transactions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "event_id" uuid,
    "amount" bigint not null,
    "stripe_payment_intent" text not null
);


alter table "public"."tickets" add column "transaction_id" uuid;

CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (id);

alter table "public"."transactions" add constraint "transactions_pkey" PRIMARY KEY using index "transactions_pkey";

alter table "public"."tickets" add constraint "tickets_transaction_id_fkey" FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."tickets" validate constraint "tickets_transaction_id_fkey";

alter table "public"."transactions" add constraint "transactions_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."transactions" validate constraint "transactions_event_id_fkey";

alter table "public"."transactions" add constraint "transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."transactions" validate constraint "transactions_user_id_fkey";


