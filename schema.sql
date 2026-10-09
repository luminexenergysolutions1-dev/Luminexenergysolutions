-- =====================================================================
-- LUMINEX ENERGY SOLUTIONS — Supabase / PostgreSQL schema
-- Run this in the Supabase SQL editor (Project → SQL → New query).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Admin users (authorisation list) ----------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ---------- Site settings (one row per section, jsonb value) ----------
-- keys: homepage_content | about | contact_information | social_links | seo_settings
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- Services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null default '',
  overview text not null default '',
  icon text not null default 'sun' check (icon in ('sun','bolt','snow','leaf')),
  image text not null default '',
  cta_text text not null default 'Learn more',
  provides text[] not null default '{}',
  benefits text[] not null default '{}',
  applications text[] not null default '{}',
  process text[] not null default '{}',
  maintenance text not null default '',
  why_luminex text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null default '',
  category text not null default 'Solar',
  description text not null default '',
  details text,
  media jsonb not null default '[]'::jsonb,
  project_date date,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  quote text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- FAQs ----------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Quote requests ----------
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 30),
  email text check (email is null or email = '' or email ~* '^\S+@\S+\.\S+$'),
  location text not null check (char_length(location) between 1 and 200),
  service text not null,
  property_type text not null,
  contact_method text not null,
  description text not null check (char_length(description) between 10 and 4000),
  attachment_url text,
  status text not null default 'New'
    check (status in ('New','Contacted','Assessment Scheduled','Quoted','Completed','Cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists quote_requests_status_idx on public.quote_requests(status);
create index if not exists quote_requests_created_idx on public.quote_requests(created_at desc);

-- ---------- Simple rate limiting on quote submissions (max 5 per minute per IP-less anon) ----------
create or replace function public.quote_rate_limit()
returns trigger language plpgsql security definer as $$
begin
  if (select count(*) from public.quote_requests where created_at > now() - interval '1 minute') > 20 then
    raise exception 'Too many requests. Please try again shortly.';
  end if;
  new.status := 'New'; -- clients cannot set status
  return new;
end $$;
drop trigger if exists quote_rate_limit_trg on public.quote_requests;
create trigger quote_rate_limit_trg before insert on public.quote_requests
for each row execute function public.quote_rate_limit();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.admin_users    enable row level security;
alter table public.site_settings  enable row level security;
alter table public.services       enable row level security;
alter table public.projects       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.faqs           enable row level security;
alter table public.quote_requests enable row level security;

-- admin_users: a user may only see their own row (used by the portal to verify access)
drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read" on public.admin_users for select using (auth.uid() = user_id);

-- Public content: anyone can read; only admins can write
do $$
declare t text;
begin
  foreach t in array array['site_settings','services','projects','testimonials','faqs'] loop
    execute format('drop policy if exists "%1$s_public_read" on public.%1$I', t);
    execute format('create policy "%1$s_public_read" on public.%1$I for select using (true)', t);
    execute format('drop policy if exists "%1$s_admin_write" on public.%1$I', t);
    execute format('create policy "%1$s_admin_write" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Quote requests: anyone can submit; only admins can read/update/delete
drop policy if exists "quotes_public_insert" on public.quote_requests;
create policy "quotes_public_insert" on public.quote_requests for insert with check (true);
drop policy if exists "quotes_admin_read" on public.quote_requests;
create policy "quotes_admin_read" on public.quote_requests for select using (public.is_admin());
drop policy if exists "quotes_admin_update" on public.quote_requests;
create policy "quotes_admin_update" on public.quote_requests for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "quotes_admin_delete" on public.quote_requests;
create policy "quotes_admin_delete" on public.quote_requests for delete using (public.is_admin());

-- =====================================================================
-- STORAGE: bucket "media" (public read; admin manage; anon may upload quote attachments)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm','video/quicktime','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 52428800,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm','video/quicktime','application/pdf'];

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "media_admin_all" on storage.objects;
create policy "media_admin_all" on storage.objects for all
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_quote_attachments_insert" on storage.objects;
create policy "media_quote_attachments_insert" on storage.objects for insert
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'quotes');

-- =====================================================================
-- SEED: default site settings (editable from the Admin Portal)
-- =====================================================================
insert into public.site_settings (key, value) values
('contact_information', '{
  "company_name": "Luminex Energy Solutions",
  "phones": ["+233 25 647 8208", "+233 55 876 9127", "+233 24 548 7608", "+233 55 461 1569"],
  "whatsapp": "+233 24 548 7608",
  "sms_number": "+233 24 548 7608",
  "email": "",
  "headquarters": "Cape Coast, Central Region, Ghana",
  "digital_address": "CA14948538",
  "service_areas": ["Accra", "Cape Coast", "Kumasi", "Sunyani", "Takoradi"],
  "business_hours": "Monday – Friday"
}'),
('social_links', '{
  "facebook_label": "Luminex Energy Solutions", "facebook_url": "https://www.facebook.com/share/1Eqtk5ZCJ4/",
  "whatsapp_label": "Luminex Energy Solutions",
  "whatsapp_channel_url": "https://whatsapp.com/channel/0029VbDGfNmFMqrZ5urUAM3r",
  "instagram_label": "@luminexenergysolutions", "instagram_url": "https://www.instagram.com/luminexenergysolutions?stkn=cHJiZWp5ejJleDZ3",
  "x_label": "@luminexenergy", "x_url": "https://x.com/luminexenergy",
  "tiktok_label": "@luminexenergysolu", "tiktok_url": "https://www.tiktok.com/@luminexenergysolu"
}'),
('seo_settings', '{
  "title": "Luminex Energy Solutions | Smart Power. Cool Comfort. Brighter Futures.",
  "description": "Reliable solar power, professional electrical works, premium air conditioning and energy-saving solutions for homes and businesses across Ghana.",
  "keywords": "solar Ghana, air conditioning Ghana, electrician Cape Coast, energy efficiency Ghana",
  "og_title": "Luminex Energy Solutions",
  "og_description": "Smart Power. Cool Comfort. Brighter Futures.",
  "og_image": "/images/hero.jpg",
  "favicon": ""
}')
on conflict (key) do nothing;

-- Homepage and About content fall back to the built-in defaults until saved from the Admin Portal.
-- Services and FAQs can be imported from defaults with one click in the Admin Portal.
