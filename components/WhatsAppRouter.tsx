"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChatBubbleIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useWhatsAppRouter } from "./WhatsAppRouterProvider";

export function WhatsAppRouter() {
  const { isOpen, close, modalOptions, whatsAppAvailable } = useWhatsAppRouter();

  if (!whatsAppAvailable || modalOptions.length === 0) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-divider bg-page p-8 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="font-display text-section text-ink">
              How can we help?
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="-mr-2 -mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary hover:bg-surface hover:text-ink transition-colors"
            >
              <Cross2Icon className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="font-body text-subtitle text-ink-secondary mt-3 leading-relaxed">
            One quick question so we can route you to the right contact on
            WhatsApp.
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-3">
            {modalOptions.map((opt) => (
              <Dialog.Close asChild key={opt.id}>
                <a
                  href={`/api/wa?route=${encodeURIComponent(opt.id)}`}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-start gap-4 rounded-md border border-divider px-5 py-4 text-left transition-colors hover:border-ink"
                >
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-on-dark"
                  >
                    <ChatBubbleIcon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-body text-body font-medium text-ink">
                      {opt.title}
                    </span>
                    {opt.subtitle ? (
                      <span className="font-body text-small text-ink-secondary mt-1 leading-relaxed">
                        {opt.subtitle}
                      </span>
                    ) : null}
                  </span>
                </a>
              </Dialog.Close>
            ))}
          </div>

          <p className="font-body text-label uppercase tracking-[0.05em] text-ink-muted mt-6">
            Opens in WhatsApp · no number stored on this page
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
