import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function Marker({ position, label, visible = true }: { position: THREE.Vector3; label: { line1: string; line2?: string }; visible?: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (ref.current) {
      // subtle pulse
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.06;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <group position={position.toArray()}>
      <mesh ref={ref} visible={visible}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial emissive={new THREE.Color(0xffd27f)} emissiveIntensity={0.9} color={0xffd27f} />
      </mesh>

      {/* halo */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={0xffd27f} transparent opacity={0.12} />
      </mesh>

      <Html position={[0, 0.08, 0]} center style={{ pointerEvents: "none" }}>
        <div className="bg-black/60 text-sm text-warm-white px-2 py-1 rounded-md backdrop-blur-sm">
          <div className="font-semibold">{label.line1}</div>
          {label.line2 && <div className="text-xs text-warm-white/70">{label.line2}</div>}
        </div>
      </Html>
    </group>
  );
}
