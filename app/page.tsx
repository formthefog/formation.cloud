'use client';

import dynamic from "next/dynamic";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import * as THREE from "three";

// Assign THREE.js globally for Vanta
if (typeof window !== "undefined") {
  // @ts-expect-error - Assign THREE to the window object
  window.THREE = THREE;
}

// Dynamically import the FogBackground component
const DynamicFogBackground = dynamic(() => import("../components/FogBackground"), {
  ssr: false,
});

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

export default function Home() {
  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] ${geistSans.variable} ${geistMono.variable}`}
    >
      {/* Add the FogBackground dynamically */}
      <DynamicFogBackground />

      <main className="flex flex-col gap-8 row-start-2 text-center m-auto items-center sm:items-start">
        <Image
          src="/Formation_Logo-1.svg"
          alt="Formation Logo"
          width={450}
          height={95}
          priority
        />
        <span className="text-xl italic text-center m-auto">
          The Fog is Coming
        </span>
      </main>
    </div>
  );
}
