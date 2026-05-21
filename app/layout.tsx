import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Instrument_Serif, DM_Serif_Display, Inter } from "next/font/google";
import { createClient } from "@supabase/supabase-js";
import { themeToCssVars, type ThemeColors } from "@/lib/theme";
import { WhatsAppRouterProvider } from "@/components/WhatsAppRouterProvider";
import { WhatsAppRouter } from "@/components/WhatsAppRouter";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { getWhatsAppSettings } from "@/lib/whatsapp.server";
import { hasWhatsAppNumber } from "@/lib/whatsapp";
import "./globals.css";

// Fetch the editable colour palette and turn it into CSS variables.
// Falls back to globals.css defaults if the theme row is missing.
async function getThemeStyle(): Promise<CSSProperties> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from("theme")
      .select("colors")
      .eq("id", 1)
      .single();
    return themeToCssVars((data?.colors as ThemeColors) ?? {}) as CSSProperties;
  } catch {
    return themeToCssVars({}) as CSSProperties;
  }
}

const brand = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-brand-google",
  display: "swap",
});

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-google",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body-google",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yard House Studio — Thoughtful Property Improvement",
  description:
    "A premium Edinburgh studio combining practical hands-on capability with strong spatial judgement, taste, and sensitivity to period homes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [themeStyle, whatsapp] = await Promise.all([
    getThemeStyle(),
    getWhatsAppSettings(),
  ]);
  const whatsAppAvailable = hasWhatsAppNumber(whatsapp);

  return (
    <html
      lang="en"
      style={themeStyle}
      className={`${brand.variable} ${display.variable} ${body.variable} antialiased`}
    >
      <body suppressHydrationWarning>
        <WhatsAppRouterProvider
          floatingEnabled={whatsapp.floating_enabled}
          whatsAppAvailable={whatsAppAvailable}
          modalOptions={whatsapp.modal_options}
        >
          {children}
          <WhatsAppFloatingButton />
          <WhatsAppRouter />
        </WhatsAppRouterProvider>
      </body>
    </html>
  );
}
