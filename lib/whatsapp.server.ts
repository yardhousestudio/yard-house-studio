import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_WHATSAPP_SETTINGS,
  parseWhatsAppSettings,
  type WhatsAppSettings,
} from "@/lib/whatsapp";

export async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("whatsapp_settings")
    .select(
      "professional_number, personal_number, floating_enabled, modal_options",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return DEFAULT_WHATSAPP_SETTINGS;
  return parseWhatsAppSettings(data);
}
