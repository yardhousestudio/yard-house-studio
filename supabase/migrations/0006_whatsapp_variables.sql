-- WhatsApp contact router variables.
-- These numbers are read ONLY by the /api/wa server route, which builds the
-- wa.me URL and returns it in response to an explicit click. They are never
-- rendered into public HTML, never sent to the browser as part of any page
-- load, and never referenced from any component prop default. Keeping them
-- out of the rendered page is what blocks scrapers and search indexers from
-- harvesting the number.
--
-- Numbers must be in international format, digits only — e.g. UK mobile
-- 07712 345678 becomes 447712345678. No '+', no spaces. The route handler
-- strips non-digits as a safety net.

insert into public.site_variables (key, value, description) values
  ('WHATSAPP_PERSONAL',
   '',
   'WhatsApp number for the homeowner route. Also the fallback when WHATSAPP_BUSINESS is empty. International format, digits only.'),
  ('WHATSAPP_BUSINESS',
   '',
   'WhatsApp Business number for the landlord route. Leave empty to fall back to WHATSAPP_PERSONAL. International format, digits only.'),
  ('WHATSAPP_MSG_HOMEOWNER',
   'Hi — I''m enquiring about work on my home in ${LOCATION}.',
   'Prefilled WhatsApp message for the homeowner route. May reference other site variables.'),
  ('WHATSAPP_MSG_LANDLORD',
   'Hi — I''m a landlord enquiring about work on a property in ${LOCATION}.',
   'Prefilled WhatsApp message for the landlord route. May reference other site variables.')
on conflict (key) do nothing;
