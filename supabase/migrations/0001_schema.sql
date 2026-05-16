-- Yard House Studio — core schema
-- Profiles mirror auth.users with a role column.
-- Pages, navbar, variables, media — all driven by the CMS.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Pages
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  og_title text,
  og_description text,
  og_image text,
  components jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  is_homepage boolean not null default false,
  has_draft boolean not null default false,
  draft_components jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index pages_slug_idx on public.pages (slug);
create index pages_published_idx on public.pages (published) where published = true;
create unique index pages_one_homepage on public.pages (is_homepage) where is_homepage = true;

-- Navbar (singleton — row id is forced to 1)
create table public.navbar (
  id int primary key default 1 check (id = 1),
  logo jsonb not null,
  links jsonb not null default '[]'::jsonb,
  cta_button jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz default now()
);

-- Variables
create table public.variable_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  "order" int not null default 0
);

create table public.site_variables (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  category_id uuid references public.variable_categories(id) on delete set null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Media
create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.media_folders(id) on delete cascade
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders(id) on delete set null,
  storage_path text not null,
  filename text not null,
  mime_type text,
  size_bytes int,
  width int,
  height int,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- updated_at trigger
create function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger pages_touch
  before update on public.pages
  for each row execute function public.touch_updated_at();

create trigger site_variables_touch
  before update on public.site_variables
  for each row execute function public.touch_updated_at();

-- Homepage protection: cannot be deleted or unpublished.
create function public.protect_homepage() returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' and old.is_homepage then
    raise exception 'Cannot delete the homepage';
  end if;
  if tg_op = 'UPDATE' and old.is_homepage and new.published = false then
    raise exception 'Cannot unpublish the homepage';
  end if;
  return coalesce(new, old);
end $$;

create trigger pages_protect_homepage
  before update or delete on public.pages
  for each row execute function public.protect_homepage();
