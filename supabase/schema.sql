-- ─────────────────────────────────────────────────────────────
-- PODIO — esquema de base de datos (Supabase / Postgres)
-- Aplicar cuando se conecte Supabase. La app corre sin esto (seed local).
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── Tabla athletes ───────────────────────────────────────────
create table if not exists public.athletes (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  full_name         text not null,
  first_name        text not null,
  sport             text not null,            -- canotaje | escalada | natacion | atletismo | vela | judo | remo | bmx
  discipline        text not null,
  city              text not null,
  province          text not null,
  bio               text not null default '',
  goal_amount       numeric not null default 0,
  raised_amount     numeric not null default 0,
  photo_url         text,
  stats             jsonb not null default '[]'::jsonb,   -- array de [valor, label] (3 ítems)
  fund_items        jsonb not null default '[]'::jsonb,   -- array de [título, descripción] (3 ítems)
  verified          boolean not null default false,
  stripe_account_id text,
  created_at        timestamptz not null default now()
);

create index if not exists athletes_verified_idx on public.athletes (verified);

-- ── Tabla donations ──────────────────────────────────────────
create table if not exists public.donations (
  id                uuid primary key default gen_random_uuid(),
  athlete_id        uuid not null references public.athletes (id) on delete cascade,
  amount            numeric not null,
  type              text not null check (type in ('once', 'monthly')),
  platform_fee      numeric not null default 0,
  net_amount        numeric not null default 0,
  donor_email       text,
  stripe_payment_id text,
  status            text not null default 'pending',
  created_at        timestamptz not null default now()
);

create index if not exists donations_athlete_idx on public.donations (athlete_id);

-- ── RPC: incremento atómico de raised_amount ─────────────────
create or replace function public.increment_raised(p_athlete_id uuid, p_amount numeric)
returns void
language sql
as $$
  update public.athletes
     set raised_amount = raised_amount + p_amount
   where id = p_athlete_id;
$$;

-- ── Row Level Security ───────────────────────────────────────
alter table public.athletes  enable row level security;
alter table public.donations enable row level security;

-- Lectura pública SOLO de atletas verificados.
create policy "athletes_public_read"
  on public.athletes for select
  using (verified = true);

-- Las donaciones NO son legibles públicamente (solo service_role / admin).
-- Las escrituras (insert/update) las hace el webhook con la service role key,
-- que bypassea RLS — no se necesita policy de insert para el público.
