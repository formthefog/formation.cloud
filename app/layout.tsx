import localFont from "next/font/local";
import "./globals.css";

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
  description: "The fog is coming.",
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
        {children}
      </body>
    </html>
  );
}
