import { WhatsAppTriggerLink } from "../WhatsAppTriggerLink";

export type CtaMode = "link" | "whatsapp-router";

type CtaProps = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  mode?: CtaMode;
};

// A single call-to-action button. Renders nothing when the label is blank,
// so CMS-driven CTAs are effectively optional.
// When mode is "whatsapp-router", `href` is ignored and the button opens the
// WhatsApp router modal instead.
export function Cta({ label, href, variant, mode = "link" }: CtaProps) {
  if (!label.trim()) return null;

  const base =
    "inline-flex items-center font-body text-small font-medium px-5 py-2.5 rounded-md transition-colors";
  const variantClass =
    variant === "primary"
      ? "bg-accent text-on-dark hover:opacity-90"
      : "border border-ink text-ink hover:bg-ink hover:text-on-dark";

  if (mode === "whatsapp-router") {
    return (
      <WhatsAppTriggerLink className={`${base} ${variantClass}`}>
        {label}
      </WhatsAppTriggerLink>
    );
  }

  return (
    <a href={href} className={`${base} ${variantClass}`}>
      {label}
    </a>
  );
}

// True when at least one of the given labels is non-blank — use to decide
// whether to render the CTA row at all.
export function hasCta(...labels: (string | undefined)[]): boolean {
  return labels.some((l) => !!l && l.trim().length > 0);
}
