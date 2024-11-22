declare module 'vanta/dist/vanta.fog.min' {
  // Define the interface for the VantaEffect object
  export interface VantaEffect {
    destroy: () => void; // Method to clean up the effect
  }

  // Define the interface for the options used to initialize the effect
  export interface VantaOptions {
    el: HTMLElement | null; // The element to attach the effect
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
    blurFactor?: number;
    speed?: number;
    zoom?: number;
    scale?: number;
    mouseControls?: boolean;
  }

  // Export the default function to initialize the effect
  export default function FOG(options: VantaOptions): VantaEffect;
}
