-- Page types — the pillar / cluster SEO content model.
--   standard : ordinary pages.
--   pillar   : broad topic hub pages.
--   cluster  : subtopic pages that belong to (and link back to) one pillar.

alter table public.pages
  add column page_type text not null default 'standard'
    check (page_type in ('standard', 'pillar', 'cluster'));

-- A cluster page's parent pillar. Null for standard and pillar pages.
alter table public.pages
  add column pillar_id uuid references public.pages(id) on delete set null;

-- Only cluster pages may carry a pillar reference.
alter table public.pages
  add constraint pages_pillar_only_for_clusters
    check (pillar_id is null or page_type = 'cluster');

create index pages_page_type_idx on public.pages (page_type);
create index pages_pillar_id_idx on public.pages (pillar_id);
