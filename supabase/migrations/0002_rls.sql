-- Row Level Security — authorization enforced in the DB, not app code.

alter table public.pages enable row level security;
alter table public.navbar enable row level security;
alter table public.site_variables enable row level security;
alter table public.variable_categories enable row level security;
alter table public.media enable row level security;
alter table public.media_folders enable row level security;
alter table public.profiles enable row level security;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Pages: anyone may read published, admins may do anything.
create policy "pages: public read published"
  on public.pages for select using (published = true);
create policy "pages: admin all"
  on public.pages for all
  using (public.is_admin()) with check (public.is_admin());

-- Navbar: public read, admin write.
create policy "navbar: public read"
  on public.navbar for select using (true);
create policy "navbar: admin write"
  on public.navbar for all
  using (public.is_admin()) with check (public.is_admin());

-- Site variables: public read, admin write.
create policy "variables: public read"
  on public.site_variables for select using (true);
create policy "variables: admin write"
  on public.site_variables for all
  using (public.is_admin()) with check (public.is_admin());

create policy "variable_categories: public read"
  on public.variable_categories for select using (true);
create policy "variable_categories: admin write"
  on public.variable_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- Media: public read, admin write.
create policy "media: public read"
  on public.media for select using (true);
create policy "media: admin write"
  on public.media for all
  using (public.is_admin()) with check (public.is_admin());

create policy "media_folders: public read"
  on public.media_folders for select using (true);
create policy "media_folders: admin write"
  on public.media_folders for all
  using (public.is_admin()) with check (public.is_admin());

-- Profiles: users read their own row; admins read any.
create policy "profiles: self read"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles: admin write"
  on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());
