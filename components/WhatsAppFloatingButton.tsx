"use client";

import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useWhatsAppRouter } from "./WhatsAppRouterProvider";

export function WhatsAppFloatingButton() {
  const { open, floatingEnabled } = useWhatsAppRouter();

  if (!floatingEnabled) return null;

  return (
    <button
      type="button"
      aria-label="Contact us on WhatsApp"
      onClick={open}
      className="fixed bottom-6 right-6 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-on-dark shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:bottom-8 md:right-8"
    >
      <ChatBubbleIcon className="h-9 w-9" aria-hidden />
    </button>
  );
}
