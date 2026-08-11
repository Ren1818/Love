import React, { useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

export default function Earth() {
  const [colorMap, normalMap, cloudsMap, nightMap] = useLoader(TextureLoader, [
    "/textures/earth/colormap.png",
    "/textures/earth/normal.png",
    "/textures/earth/clouds.png",
    "/textures/earth/night.png"
  ]);

  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    // slow rotation
    earthRef.current.rotation.y += delta * 0.06;
    cloudsRef.current.rotation.y += delta * 0.08;
  });

  useEffect(() => {
    return () => {
      [colorMap, normalMap, cloudsMap, nightMap].forEach((t) => t?.dispose && t.dispose());
    };
  }, [colorMap, normalMap, cloudsMap, nightMap]);

  return (
    <group>
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* night lights as subtle emissive layer */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.001, 64, 64]} />
        <meshBasicMaterial map={nightMap} blending={THREE.AdditiveBlending} transparent opacity={0.6} toneMapped={false} />
      </mesh>

      {/* clouds / atmosphere */}
      <mesh ref={cloudsRef} position={[0, 0, 0]}> 
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshPhongMaterial map={cloudsMap} transparent opacity={0.28} depthWrite={false} />
      </mesh>

      {/* subtle atmosphere glow */}
      <mesh scale={[1.06, 1.06, 1.06]}> 
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          transparent
          uniforms={{
            c: { value: 0.5 },
            p: { value: 4.0 },
            glowColor: { value: new THREE.Color(0x3fb0ff) }
          }}
          vertexShader={/* glsl */`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `}
          fragmentShader={/* glsl */`
            uniform float c; uniform float p; uniform vec3 glowColor; varying vec3 vNormal;
            void main() {
              float intensity = pow(c - dot(vNormal, vec3(0.0,0.0,1.0)), p);
              gl_FragColor = vec4(glowColor, intensity * 0.35);
            }
          `}
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
