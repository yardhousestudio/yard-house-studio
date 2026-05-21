import { getWhatsAppSettings } from "@/lib/whatsapp.server";
import { WhatsAppEditor } from "@/components/admin/WhatsAppEditor";

export default async function WhatsAppAdminPage() {
  const settings = await getWhatsAppSettings();

  return (
    <div>
      <h1 className="font-display text-section text-ink">WhatsApp</h1>
      <p className="font-body text-small text-ink-secondary mt-1 mb-6">
        Phone numbers are never shown on the public site — only used when a
        visitor clicks through to WhatsApp. The floating icon can be toggled
        independently of header and page links.
      </p>
      <WhatsAppEditor initial={settings} />
    </div>
  );
}
