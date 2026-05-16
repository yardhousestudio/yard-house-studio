-- Media storage bucket — public read, admin write.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media bucket: public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media bucket: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

create policy "media bucket: admin update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media bucket: admin delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
