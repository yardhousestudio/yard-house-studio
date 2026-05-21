"use client";

import type { ReactNode } from "react";
import { useWhatsAppRouter } from "./WhatsAppRouterProvider";

type Props = {
  children: ReactNode;
  className?: string;
};

// A button that styles like a link or CTA, but opens the WhatsApp router
// modal instead of navigating. Used wherever a CMS-editable element should
// trigger the router (CenteredContact items, header CTA, etc.) without
// embedding the WhatsApp number in the page.
export function WhatsAppTriggerLink({ children, className }: Props) {
  const { open } = useWhatsAppRouter();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
