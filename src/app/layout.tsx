import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import { Providers } from "@/components/site/Providers";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const sans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://glowmartofficial.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Glow Mart · Beauty, watches & jewellery",
    template: "%s · Glow Mart",
  },
  description:
    "Glow Mart — curated female accessories, beauty essentials, watches, and jewellery. Shop glowmartofficial.com.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Glow Mart",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fffafc] font-sans text-rose-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
