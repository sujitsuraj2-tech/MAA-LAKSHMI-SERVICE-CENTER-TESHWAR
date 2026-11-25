-- Run this SQL once in your Supabase Dashboard -> SQL Editor
-- Project: MAA LAKSHMI AUTO SERVICE CENTER

create table if not exists public.workshop_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.service_bookings (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null default '',
  customer_name text not null default '',
  customer_phone text not null default '',
  bike_model text not null,
  service_name text not null,
  preferred_date text not null default '',
  pickup_needed boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.service_bookings add column if not exists reference_code text not null default '';
alter table public.service_bookings add column if not exists customer_name text not null default '';
alter table public.service_bookings add column if not exists customer_phone text not null default '';
alter table public.service_bookings add column if not exists preferred_date text not null default '';

alter table public.workshop_store enable row level security;
alter table public.service_bookings enable row level security;

-- Allow public read ONLY for the non-sensitive Shop Owner photo row
drop policy if exists "Public can read owner photo" on public.workshop_store;
create policy "Public can read owner photo"
  on public.workshop_store
  for select
  to anon, authenticated
  using (key = 'owner_photo');

-- Allow direct booking submissions from the backend API while keeping customer bookings private (no public SELECT)
drop policy if exists "Allow insert service bookings" on public.service_bookings;
create policy "Allow insert service bookings"
  on public.service_bookings
  for insert
  to anon, authenticated
  with check (
    char_length(customer_name) >= 2
    and char_length(customer_phone) = 10
    and char_length(bike_model) >= 1
    and char_length(service_name) >= 1
  );
