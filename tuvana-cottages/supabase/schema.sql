-- =====================================================================
--  Tuvana Cottages — database schema
--  Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
--  Safe to re-run: every statement is idempotent.
-- =====================================================================

create extension if not exists pgcrypto;
create extension if not exists btree_gist;   -- required for the no-overlap constraint

-- ---------------------------------------------------------------------
--  Booking lifecycle
--
--  pending_payment  guest reserved the dates, hold timer is running
--  awaiting_review  guest uploaded a receipt, owner must confirm
--  confirmed        owner verified the transfer — dates are locked
--  rejected         owner refused the receipt
--  cancelled        cancelled by owner or guest
--  expired          hold ran out before payment was declared
-- ---------------------------------------------------------------------
do $$ begin
  create type booking_status as enum (
    'pending_payment', 'awaiting_review', 'confirmed',
    'rejected', 'cancelled', 'expired'
  );
exception when duplicate_object then null; end $$;


-- ---------------------------------------------------------------------
--  Cabins
-- ---------------------------------------------------------------------
create table if not exists cabins (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  tagline        text,
  description    text,
  capacity       int  not null default 6,
  bedrooms       int  not null default 1,
  bathrooms      int  not null default 1,
  price_weekday  numeric(10,2) not null,
  price_weekend  numeric(10,2) not null,
  images         jsonb not null default '[]'::jsonb,
  amenities      jsonb not null default '[]'::jsonb,
  sort_order     int  not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);


-- ---------------------------------------------------------------------
--  Bookings
--
--  `stay` is a generated half-open date range [check_in, check_out):
--  a stay that checks out on the 5th does NOT occupy the night of the
--  5th, so the next guest can check in that same day.
--
--  Rows with is_block = true are the owner's manual date blocks
--  (maintenance, personal use). They ride on the same table so the
--  overlap constraint protects them too.
-- ---------------------------------------------------------------------
create table if not exists bookings (
  id               uuid primary key default gen_random_uuid(),
  ref_code         text unique not null,
  cabin_id         uuid not null references cabins(id) on delete cascade,

  guest_name       text,
  guest_phone      text,
  guests_count     int,
  notes            text,

  check_in         date not null,
  check_out        date not null,
  stay             daterange generated always as
                     (daterange(check_in, check_out, '[)')) stored,
  nights           int generated always as (check_out - check_in) stored,

  total_amount     numeric(10,2) not null default 0,
  status           booking_status not null default 'pending_payment',
  hold_expires_at  timestamptz,
  paid_declared_at timestamptz,
  receipt_path     text,
  admin_note       text,
  is_block         boolean not null default false,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint bookings_valid_range check (check_out > check_in)
);

-- ---------------------------------------------------------------------
--  THE anti-double-booking guarantee.
--
--  Enforced by Postgres, not by application code: two guests tapping
--  "book" on the same night at the same millisecond cannot both win.
--  One transaction commits, the other raises exclusion_violation, which
--  create_booking() translates into a friendly "dates_unavailable".
--
--  The predicate deliberately includes pending_payment so an in-flight
--  hold blocks other guests. create_booking() sweeps expired holds in
--  the same transaction before inserting, so a dead hold never blocks.
-- ---------------------------------------------------------------------
do $$ begin
  alter table bookings add constraint bookings_no_overlap
    exclude using gist (cabin_id with =, stay with &&)
    where (status in ('pending_payment', 'awaiting_review', 'confirmed'));
exception when duplicate_object then null; end $$;

create index if not exists bookings_cabin_stay_idx  on bookings using gist (cabin_id, stay);
create index if not exists bookings_status_idx      on bookings (status);
create index if not exists bookings_hold_idx        on bookings (hold_expires_at)
  where status = 'pending_payment';
create index if not exists bookings_phone_idx       on bookings (guest_phone);


-- ---------------------------------------------------------------------
--  Site settings — single row, edited from /admin/settings
-- ---------------------------------------------------------------------
create table if not exists settings (
  id                int primary key default 1 check (id = 1),
  brand_name        text not null default 'أكواخ توفانا',
  brand_name_en     text not null default 'Tuvana Cottages',
  about             text,
  phone             text not null default '0534007175',
  whatsapp          text not null default '966534007175',
  address           text not null default 'منطقة عسير - تنومة',
  map_url           text,
  latitude          numeric(10,7),
  longitude         numeric(10,7),

  bank_name         text,
  account_name      text,
  iban              text,

  hold_minutes      int not null default 15,
  deposit_percent   int not null default 100
                      check (deposit_percent between 1 and 100),
  check_in_time     text not null default '4:00 م',
  check_out_time    text not null default '12:00 م',
  policies          jsonb not null default '[]'::jsonb,
  updated_at        timestamptz not null default now()
);

insert into settings (id) values (1) on conflict (id) do nothing;


-- =====================================================================
--  Functions
-- =====================================================================

-- Human-friendly booking reference, e.g. TV-8F3K2Q.
-- Ambiguous characters (0/O, 1/I) are excluded so guests can read it
-- off a screen and type it into WhatsApp without mistakes.
create or replace function gen_ref_code() returns text as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  out_code text := '';
  i int;
begin
  for i in 1..6 loop
    out_code := out_code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return 'TV-' || out_code;
end $$ language plpgsql volatile;


-- Price a stay night by night, on the server, so a tampered client
-- payload can never change what the guest is asked to transfer.
-- Saudi weekend is Friday + Saturday, so the nights that start on
-- Thursday (dow 4) and Friday (dow 5) are the weekend-priced ones.
create or replace function calc_stay_price(
  p_cabin uuid, p_check_in date, p_check_out date
) returns numeric as $$
declare
  d       date;
  total   numeric := 0;
  weekday numeric;
  weekend numeric;
begin
  select price_weekday, price_weekend into weekday, weekend
    from cabins where id = p_cabin and is_active;
  if weekday is null then
    raise exception 'cabin_not_found';
  end if;

  d := p_check_in;
  while d < p_check_out loop
    if extract(dow from d) in (4, 5) then
      total := total + weekend;
    else
      total := total + weekday;
    end if;
    d := d + 1;
  end loop;

  return total;
end $$ language plpgsql stable;


-- Release holds whose timer ran out. Called inside create_booking() and
-- by the cron route, but the site never depends on it having run: every
-- availability read filters on hold_expires_at directly, so a date frees
-- itself the instant the timer hits zero.
create or replace function expire_holds() returns int as $$
declare n int;
begin
  update bookings
     set status = 'expired', updated_at = now()
   where status = 'pending_payment'
     and hold_expires_at <= now();
  get diagnostics n = row_count;
  return n;
end $$ language plpgsql volatile;


-- Every individual night that is NOT bookable in the given window.
create or replace function unavailable_dates(
  p_cabin uuid, p_from date, p_to date
) returns setof date as $$
  select distinct g.d::date
    from bookings b
    cross join lateral generate_series(
      b.check_in, b.check_out - 1, interval '1 day'
    ) as g(d)
   where b.cabin_id = p_cabin
     and b.check_in < p_to
     and b.check_out > p_from
     and (
       b.status in ('awaiting_review', 'confirmed')
       or (b.status = 'pending_payment' and b.hold_expires_at > now())
     )
     and g.d::date >= p_from
     and g.d::date <  p_to
   order by 1;
$$ language sql stable;


-- Create a booking and start the hold timer. Atomic: either the guest
-- owns every night of the range, or nothing is written at all.
create or replace function create_booking(
  p_cabin    uuid,
  p_check_in date,
  p_check_out date,
  p_name     text,
  p_phone    text,
  p_guests   int,
  p_notes    text default null
) returns bookings as $$
declare
  b            bookings;
  hold_min     int;
  cabin_cap    int;
  new_ref      text;
  attempts     int := 0;
begin
  if p_check_out <= p_check_in then
    raise exception 'invalid_range';
  end if;
  if p_check_in < current_date then
    raise exception 'past_date';
  end if;

  select capacity into cabin_cap from cabins where id = p_cabin and is_active;
  if cabin_cap is null then
    raise exception 'cabin_not_found';
  end if;
  if p_guests is null or p_guests < 1 or p_guests > cabin_cap then
    raise exception 'invalid_guests';
  end if;

  -- Free any dead holds first, in this same transaction, so an abandoned
  -- checkout from 20 minutes ago cannot block a paying guest.
  perform expire_holds();

  select coalesce(hold_minutes, 15) into hold_min from settings where id = 1;
  hold_min := coalesce(hold_min, 15);

  loop
    attempts := attempts + 1;
    new_ref  := gen_ref_code();
    begin
      insert into bookings (
        ref_code, cabin_id, check_in, check_out,
        guest_name, guest_phone, guests_count, notes,
        total_amount, status, hold_expires_at
      ) values (
        new_ref, p_cabin, p_check_in, p_check_out,
        p_name, p_phone, p_guests, p_notes,
        calc_stay_price(p_cabin, p_check_in, p_check_out),
        'pending_payment',
        now() + make_interval(mins => hold_min)
      )
      returning * into b;
      exit;
    exception
      when exclusion_violation then
        -- Someone else holds at least one of these nights.
        raise exception 'dates_unavailable';
      when unique_violation then
        -- Reference code collision: try another one.
        if attempts >= 5 then raise; end if;
    end;
  end loop;

  return b;
end $$ language plpgsql volatile;


-- Guest declares they transferred the money. Stops the countdown and
-- hands the booking to the owner for confirmation.
create or replace function mark_paid(
  p_ref text, p_phone text, p_receipt text
) returns bookings as $$
declare b bookings;
begin
  update bookings
     set status           = 'awaiting_review',
         receipt_path     = coalesce(p_receipt, receipt_path),
         paid_declared_at = now(),
         updated_at       = now()
   where ref_code    = p_ref
     and guest_phone = p_phone
     and status      = 'pending_payment'
     and hold_expires_at > now()
  returning * into b;

  if b.id is null then
    raise exception 'hold_expired_or_not_found';
  end if;
  return b;
end $$ language plpgsql volatile;


-- Owner blocks a date range (maintenance, personal use). Rides on the
-- bookings table so the overlap constraint applies to blocks as well.
create or replace function create_block(
  p_cabin uuid, p_from date, p_to date, p_reason text default null
) returns bookings as $$
declare b bookings;
begin
  if p_to <= p_from then raise exception 'invalid_range'; end if;
  perform expire_holds();
  begin
    insert into bookings (
      ref_code, cabin_id, check_in, check_out,
      status, is_block, admin_note, total_amount
    ) values (
      'BLK-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6),
      p_cabin, p_from, p_to, 'confirmed', true, p_reason, 0
    ) returning * into b;
  exception when exclusion_violation then
    raise exception 'dates_unavailable';
  end;
  return b;
end $$ language plpgsql volatile;


-- =====================================================================
--  Row level security
--
--  No policies are defined, so anon and authenticated roles can read
--  nothing. Every query in the app goes through Next.js route handlers
--  using the service role key, which bypasses RLS and never reaches the
--  browser. Guest phone numbers and receipts stay server-side.
-- =====================================================================
alter table cabins   enable row level security;
alter table bookings enable row level security;
alter table settings enable row level security;


-- =====================================================================
--  Storage bucket for transfer receipts (private).
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;
