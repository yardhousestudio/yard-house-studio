"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WhatsAppModalOption } from "@/lib/whatsapp";

type WhatsAppRouterContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Floating FAB only — other triggers ignore this. */
  floatingEnabled: boolean;
  /** At least one number is configured. */
  whatsAppAvailable: boolean;
  modalOptions: WhatsAppModalOption[];
};

const WhatsAppRouterContext = createContext<WhatsAppRouterContextValue | null>(
  null,
);

type ProviderProps = {
  children: ReactNode;
  floatingEnabled: boolean;
  whatsAppAvailable: boolean;
  modalOptions: WhatsAppModalOption[];
};

export function WhatsAppRouterProvider({
  children,
  floatingEnabled,
  whatsAppAvailable,
  modalOptions,
}: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    if (!whatsAppAvailable || modalOptions.length === 0) return;
    setIsOpen(true);
  }, [whatsAppAvailable, modalOptions.length]);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      isOpen,
      open,
      close,
      floatingEnabled: floatingEnabled && whatsAppAvailable,
      whatsAppAvailable,
      modalOptions,
    }),
    [isOpen, open, close, floatingEnabled, whatsAppAvailable, modalOptions],
  );

  return (
    <WhatsAppRouterContext.Provider value={value}>
      {children}
    </WhatsAppRouterContext.Provider>
  );
}

export function useWhatsAppRouter(): WhatsAppRouterContextValue {
  const ctx = useContext(WhatsAppRouterContext);
  if (!ctx) {
    throw new Error(
      "useWhatsAppRouter must be used within a WhatsAppRouterProvider",
    );
  }
  return ctx;
}
