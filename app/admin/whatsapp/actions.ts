"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  WhatsAppModalOptionSchema,
  normalizePhoneInput,
} from "@/lib/whatsapp";

const SaveSchema = z.object({
  professional_number: z.string(),
  personal_number: z.string(),
  floating_enabled: z.boolean(),
  modal_options: z.array(WhatsAppModalOptionSchema).min(1),
});

export async function saveWhatsAppSettings(input: unknown) {
  const data = SaveSchema.parse(input);
  const ids = data.modal_options.map((o) => o.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Each modal option needs a unique route id.");
  }
  const supabase = await createClient();

  const { error } = await supabase.from("whatsapp_settings").upsert(
    {
      id: 1,
      professional_number: normalizePhoneInput(data.professional_number),
      personal_number: normalizePhoneInput(data.personal_number),
      floating_enabled: data.floating_enabled,
      modal_options: data.modal_options,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/whatsapp");
}
