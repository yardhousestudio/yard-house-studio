import { z } from "zod";

export const WhatsAppModalOptionSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Route id: lowercase letters, numbers, hyphens only"),
  title: z.string().min(1),
  subtitle: z.string(),
  message: z.string(),
});

export type WhatsAppModalOption = z.infer<typeof WhatsAppModalOptionSchema>;

export type WhatsAppSettings = {
  professional_number: string;
  personal_number: string;
  floating_enabled: boolean;
  modal_options: WhatsAppModalOption[];
};

export const DEFAULT_WHATSAPP_MODAL_OPTIONS: WhatsAppModalOption[] = [
  {
    id: "homeowner",
    title: "I'm a homeowner",
    subtitle: "Work on your own home — renovation, repair, improvement.",
    message: "Hi — I'm enquiring about work on my home in ${LOCATION}.",
  },
  {
    id: "landlord",
    title: "I'm a landlord or manage property",
    subtitle: "Rentals, turnaround, maintenance across a property portfolio.",
    message: "Hi — I'm a landlord enquiring about work on a property in ${LOCATION}.",
  },
];

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  professional_number: "",
  personal_number: "",
  floating_enabled: true,
  modal_options: DEFAULT_WHATSAPP_MODAL_OPTIONS,
};

const SettingsRowSchema = z.object({
  professional_number: z.string().optional(),
  personal_number: z.string().optional(),
  floating_enabled: z.boolean().optional(),
  modal_options: z.unknown().optional(),
});

export function parseWhatsAppSettings(row: unknown): WhatsAppSettings {
  const parsed = SettingsRowSchema.safeParse(row);
  if (!parsed.success) return DEFAULT_WHATSAPP_SETTINGS;

  const optionsResult = z
    .array(WhatsAppModalOptionSchema)
    .safeParse(parsed.data.modal_options);

  return {
    professional_number: parsed.data.professional_number ?? "",
    personal_number: parsed.data.personal_number ?? "",
    floating_enabled: parsed.data.floating_enabled ?? true,
    modal_options: optionsResult.success
      ? optionsResult.data
      : DEFAULT_WHATSAPP_MODAL_OPTIONS,
  };
}

/**
 * Digits-only, then UK local (0…) → international (44…) for wa.me / WhatsApp desktop.
 * WhatsApp rejects numbers like 07729916070; they must be 447729916070.
 */
export function normalizeWhatsAppNumber(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("44")) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return `44${digits.slice(1)}`;
  return digits;
}

/** Primary → secondary fallback (YAR-5). */
export function resolveWhatsAppNumber(
  settings: Pick<WhatsAppSettings, "professional_number" | "personal_number">,
): string {
  const professional = normalizeWhatsAppNumber(settings.professional_number);
  const personal = normalizeWhatsAppNumber(settings.personal_number);
  return professional || personal;
}

export function hasWhatsAppNumber(
  settings: Pick<WhatsAppSettings, "professional_number" | "personal_number">,
): boolean {
  return resolveWhatsAppNumber(settings).length > 0;
}

export function slugifyRouteId(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `option-${Date.now()}`;
}

export function normalizePhoneInput(value: string): string {
  return normalizeWhatsAppNumber(value);
}
