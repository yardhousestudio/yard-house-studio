-- Editable colour palette — a singleton row holding the 10 colour tokens.
-- The site injects these at runtime; globals.css @theme stays as the fallback.

create table public.theme (
  id int primary key default 1 check (id = 1),
  colors jsonb not null,
  updated_at timestamptz default now()
);

alter table public.theme enable row level security;

create policy "theme: public read"
  on public.theme for select using (true);
create policy "theme: admin write"
  on public.theme for all
  using (public.is_admin()) with check (public.is_admin());

-- Seed with the current Craig & Rose palette.
insert into public.theme (id, colors) values (1, '{
  "page": "#FFFFFF",
  "surface": "#FAF8F3",
  "frame": "#C8BB9F",
  "dark": "#4A4A2F",
  "ink": "#1A1A1A",
  "ink-secondary": "#4A4339",
  "ink-muted": "#A89E8B",
  "on-dark": "#FFFFFF",
  "divider": "#D8D1C5",
  "accent": "#AC4B22"
}'::jsonb)
on conflict (id) do nothing;
