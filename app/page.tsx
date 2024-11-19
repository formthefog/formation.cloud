'use client'
import Image from "next/image";
import { useEffect, useRef } from "react";
import * as THREE from "three";


function FogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Fog and Background Color
    scene.fog = new THREE.FogExp2(0x999999, 0.03);
    scene.background = new THREE.Color(0x0);

    // Geometry and Material
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const spheres: THREE.Mesh[] = [];

    // Create Fog Particles
    for (let i = 0; i < 200; i++) {
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      );
      spheres.push(sphere);
      scene.add(sphere);
    }

    camera.position.z = 5;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update positions for fog effect
      spheres.forEach((sphere) => {
        sphere.position.z += 0.1;
        if (sphere.position.z > 50) sphere.position.z = -50;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      spheres.forEach((sphere) => scene.remove(sphere));
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <FogCanvas />
        <Image
          src="/Formation_Logo-1.svg"
          alt="Next.js logo"
          width={450}
          height={95}
          priority
        />

      </main>
    </div>
  );
}
