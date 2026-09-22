import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { card } from "@/app/_config/card";
import { introBootScript } from "@/app/_lib/intro";
import { colors } from "@/app/_theme/tokens";
import "./globals.css";

// next/font self-hosts these at build time — no runtime third-party requests.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Not needed for first paint.
});

const { site, icons, person } = card;
const hasSiteUrl = site.url.length > 0;
const ogImage = { url: site.ogImage, width: 1200, height: 630, alt: site.ogImageAlt };

export const metadata: Metadata = {
  // Canonical/OG URLs only when the deployment provides a base URL — never localhost.
  ...(hasSiteUrl && {
    metadataBase: new URL(site.url),
    alternates: { canonical: "/" },
  }),
  title: site.title,
  description: site.description,
  applicationName: site.appName,
  authors: [{ name: person.name }],
  icons: {
    icon: [
      { url: icons.favicon32, sizes: "32x32", type: "image/png" },
      { url: icons.favicon16, sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: icons.appleTouch, sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: site.shortName,
    statusBarStyle: "black-translucent",
  },
  other: { "mobile-web-app-capable": "yes" },
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: site.shortName,
    ...(hasSiteUrl && { url: "/", images: [ogImage] }),
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    ...(hasSiteUrl && { images: [ogImage] }),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: colors.canvas,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Boot script adds intro classes before hydration.
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <noscript>
          <style>{`.lux-preloader{display:none}.lux-hero-target,.lux-mask>span,.lux-hero-bg{opacity:1;transform:none}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
