import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

function FogPlane({ textureUrl }: { textureUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      tex: { value: new THREE.TextureLoader().load(textureUrl) },
    }),
    [textureUrl]
  );

  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  useEffect(() => {
    // Configure the texture wrapping and tiling for a smoother effect
    uniforms.tex.value.wrapS = THREE.RepeatWrapping;
    uniforms.tex.value.wrapT = THREE.RepeatWrapping;
    uniforms.tex.value.repeat.set(3, 3); // Adjust tiling here
  }, [uniforms]);

  return (
    <mesh ref={meshRef} position={[0, 0, -500]}>
      <planeGeometry args={[2000, 2000, 20, 20]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;

          uniform sampler2D tex;
          uniform float time;

          varying vec2 vUv;

          void main() {
            // Scroll the texture over time for motion
            vec2 uv = vUv + vec2(time * 0.02, time * 0.03);

            // Sample the texture and blend opacity for subtle fog
            vec4 texColor = texture2D(tex, uv);
            float opacity = 0.15 + 0.15 * sin(time + uv.y * 5.0);

            // Darken and soften the edges
            float edgeSoftness = smoothstep(0.0, 0.5, 1.0 - length(uv - 0.5));
            gl_FragColor = vec4(texColor.rgb * edgeSoftness, opacity * edgeSoftness);
          }
        `}
        transparent
      />
    </mesh>
  );
}
export default function FogBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1000], fov: 75, near: 0.1, far: 5000 }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    >
      <fog attach="fog" args={["#111111", 500, 2000]} />
      <ambientLight intensity={0.5} />
      <FogPlane textureUrl="https://ykob.github.io/sketch-threejs/img/sketch/fog/fog.png" />
    </Canvas>
  );
}

