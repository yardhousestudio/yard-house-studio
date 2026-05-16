import type { Metadata } from "next";
import { Instrument_Serif, DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${brand.variable} ${display.variable} ${body.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
