/* eslint-disable */
'use client';

import { useEffect, useRef, useState } from "react";
import FOG from 'vanta/dist/vanta.fog.min';

export default function FogBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null); // Use proper typing if needed
  const myRef = useRef<HTMLDivElement | null>(null); // Explicitly type the ref

  useEffect(() => {
    // Ensure THREE.js is available before initializing Vanta
    // @ts-expect-error woo
    if (!window.THREE) {
      console.warn("THREE.js is not available on the window object.");
      return;
    }

    // Initialize VANTA effect if not already initialized
    if (!vantaEffect && myRef.current) {
      try {
        setVantaEffect(
          FOG({
            el: myRef.current,
            highlightColor: 0x4a90e2,
            midtoneColor: 0x1c2a3a,
            lowlightColor: 0x0d1117,
            baseColor: 0x000000,
            blurFactor: 0.6,
            speed: 1,
            zoom: 1,
            scale: 2,
            mouseControls: true,
          })
        );
      } catch (error) {
        console.error("Error initializing Vanta effect:", error);
      }
    }

    // Cleanup VANTA effect on unmount
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null); // Reset the state
      }
    };
  }, [vantaEffect]);

  return (
    <div
      ref={myRef}
      style={{ height: "100vh", width: "100vw", position: "absolute", zIndex: -1 }}
    />
  );
}
