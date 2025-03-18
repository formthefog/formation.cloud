import localFont from "next/font/local";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import Head from "next/head";

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
    { path: "./fonts/Hauora Sans/web/Hauora-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Hauora Sans/web/Hauora-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Hauora Sans/web/Hauora-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Hauora Sans/web/Hauora-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Hauora Sans/web/Hauora-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Hauora Sans/web/Hauora-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-hauora-sans",
});

// Inter Display Font Configurations
const interDisplay = localFont({
  src: [
    { path: "./fonts/Inter Display/InterDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Inter Display/InterDisplay-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/Inter Display/InterDisplay-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/Inter Display/InterDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/Inter Display/InterDisplay-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/Inter Display/InterDisplay-ExtraBold.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-inter-display",
});

// Dynamic Metadata Export
export const metadata = {
  title: "Formation",
  description: "A Fog is Forming...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* HTML Meta Tags */}
        <title>Formation</title>
        <meta name="description" content="A Fog is Forming..." />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://formation.cloud" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Formation" />
        <meta property="og:description" content="A Fog is Forming..." />
        <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/52ad98f5-7554-466b-b96a-6fa0cc77376d.png?token=m6B_oJysXF-CAFf_wUXXSH7XK2M3881DA8i0LwAym-4&height=569&width=569&expires=33278307078" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="formation.cloud" />
        <meta property="twitter:url" content="https://formation.cloud" />
        <meta name="twitter:title" content="Formation" />
        <meta name="twitter:description" content="A Fog is Forming..." />
        <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/52ad98f5-7554-466b-b96a-6fa0cc77376d.png?token=m6B_oJysXF-CAFf_wUXXSH7XK2M3881DA8i0LwAym-4&height=569&width=569&expires=33278307078" />
      </Head>
      <body
        className={`${geistSans.variable} ${hauoraSans.variable} ${interDisplay.variable} ${geistMono.variable} antialiased`}
      >
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
