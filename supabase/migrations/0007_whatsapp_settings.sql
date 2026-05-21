-- WhatsApp router CMS settings (singleton).
-- Phone numbers are only consumed server-side by /api/wa.

create table public.whatsapp_settings (
  id int primary key default 1 check (id = 1),
  professional_number text not null default '',
  personal_number text not null default '',
  floating_enabled boolean not null default true,
  modal_options jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

alter table public.whatsapp_settings enable row level security;

create policy "whatsapp_settings: public read"
  on public.whatsapp_settings for select using (true);
create policy "whatsapp_settings: admin write"
  on public.whatsapp_settings for all
  using (public.is_admin()) with check (public.is_admin());

create trigger whatsapp_settings_touch
  before update on public.whatsapp_settings
  for each row execute function public.touch_updated_at();

insert into public.whatsapp_settings (
  id,
  professional_number,
  personal_number,
  floating_enabled,
  modal_options
)
select
  1,
  coalesce((select value from public.site_variables where key = 'WHATSAPP_BUSINESS'), ''),
  coalesce((select value from public.site_variables where key = 'WHATSAPP_PERSONAL'), ''),
  true,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', opt.id,
          'title', opt.title,
          'subtitle', opt.subtitle,
          'message', opt.message
        )
        order by opt.ord
      )
      from (
        values
          (
            1,
            'homeowner',
            'I''m a homeowner',
            'Work on your own home — renovation, repair, improvement.',
            coalesce(
              (select value from public.site_variables where key = 'WHATSAPP_MSG_HOMEOWNER'),
              'Hi — I''m enquiring about work on my home in ${LOCATION}.'
            )
          ),
          (
            2,
            'landlord',
            'I''m a landlord or manage property',
            'Rentals, turnaround, maintenance across a property portfolio.',
            coalesce(
              (select value from public.site_variables where key = 'WHATSAPP_MSG_LANDLORD'),
              'Hi — I''m a landlord enquiring about work on a property in ${LOCATION}.'
            )
          )
      ) as opt(ord, id, title, subtitle, message)
    ),
    '[]'::jsonb
  )
on conflict (id) do nothing;
