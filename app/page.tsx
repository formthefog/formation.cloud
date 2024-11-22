'use client'
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
// @ts-ignore
import FOG from 'vanta/dist/vanta.fog.min';

export default function Home() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    // Add fade-in effect
    const container = myRef.current;
    if (container) {
      // @ts-ignore
      container.style.opacity = "0";
      // @ts-ignore
      container.style.transition = "opacity 2s ease-in-out"; // Fade-in duration

      setTimeout(() => {
        // @ts-ignore
        container.style.opacity = "1";
      }, 0); // Trigger fade-in immediately
    }

    // Initialize VANTA effect
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: myRef.current,
          highlightColor: 0x4a90e2, // A soft, dark blue highlight (e.g., "#4A90E2")
          midtoneColor: 0x1c2a3a,   // A deep, desaturated blue-gray
          lowlightColor: 0x0d1117,  // Very dark gray (almost black)
          baseColor: 0x000000,
          blurFactor: 0.6,         // Controls the blur intensity
          speed: 1,                // Animation speed
          zoom: 1,                 // Zoom level of the effect
          scale: 2,
          mouseControls: true
        })
      );
    }

    // Cleanup VANTA effect on unmount
    return () => {
      // @ts-ignore
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={myRef}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    >
      <main className="flex flex-col gap-8 row-start-2 text-center m-auto items-center sm:items-start">
        <Image
          src="/Formation_Logo-1.svg"
          alt="Next.js logo"
          width={450}
          height={95}
          priority
        />
        <span className=" text-xl italic text-center m-auto animate-pulse font-black">The Fog is Coming</span>
      </main>
    </div>
  );
}
