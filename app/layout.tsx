import localFont from "next/font/local";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Hauora Sans Font Configurations
const hauoraSans = localFont({
  src: [
    {
      path: "./fonts/Hauora Sans/web/Hauora-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Hauora Sans/web/Hauora-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Hauora Sans/web/Hauora-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Hauora Sans/web/Hauora-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Hauora Sans/web/Hauora-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Hauora Sans/web/Hauora-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-hauora-sans",
});

// Inter Display Font Configurations
const interDisplay = localFont({
  src: [
    {
      path: "./fonts/Inter Display/InterDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Inter Display/InterDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Inter Display/InterDisplay-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Inter Display/InterDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Inter Display/InterDisplay-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Inter Display/InterDisplay-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-inter-display",
});

// app/layout.tsx
export const metadata = {
  metadataBase: new URL("https://formation.cloud"),
  title: {
    default: "Formation",
    template: "%s — Formation",
  },
  description:
    "Formation.cloud is the agent marketplace—discover, customize and deploy ready-made agents on pay-per-use or subscription plans.",
  keywords: [
    "AI agents",
    "marketplace",
    "pay per use",
    "agent deployment",
    "Next.js",
    "React",
    "TypeScript",
    "decentralized cloud",
  ],
  applicationName: "Formation",
  generator: "Next.js",
  viewport: "width=device-width,initial-scale=1",
  themeColor: "#009CFF",
  robots: "index, follow",
  canonical: "https://formation.cloud",

  // Open Graph (Discord, Slack, iMessage…)
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Formation",
    url: "https://formation.cloud",
    title: "Formation",
    description:
      "The AI-agent marketplace: build, discover & deploy pre-built agents in seconds.",
    images: [
      {
        url: "/formation-og-image.jpg",
        width: 430,
        height: 430,
        alt: "Formation – Agent Marketplace",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@formthefog",
    creator: "@formthefog",
    title: "Formation",
    description:
      "Discover & deploy pre-built agents in seconds—pay-per-use or subscription.",
    images: ["/formation-og-image.jpg"],
  },

  // Favicons & PWA
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${hauoraSans.variable} ${interDisplay.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ModalProvider>{children}</ModalProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
