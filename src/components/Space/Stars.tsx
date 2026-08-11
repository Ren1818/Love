import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Stars({ count = 600, interactiveCount = 8, loveMessages = [], onMessage }: { count?: number; interactiveCount?: number; loveMessages?: string[]; onMessage?: (idx: number, pos: THREE.Vector3) => void }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const [hovered, setHovered] = useState<number | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 12 + Math.random() * 40;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count]);

  const interactiveIndices = useMemo(() => {
    const idxs: number[] = [];
    if (interactiveCount <= 0) return idxs;
    const step = Math.floor(count / interactiveCount);
    for (let i = 0; i < interactiveCount; i++) {
      idxs.push(Math.min(count - 1, i * step + Math.floor(Math.random() * Math.max(1, step - 1))));
    }
    return idxs;
  }, [count, interactiveCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.size = 0.5 + Math.sin(t * 1.2) * 0.12 + (hovered ? 0.2 : 0);
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  function handlePointerDown(e: any) {
    if (!e.index && e.index !== 0) return;
    const idx = e.index as number;
    // find nearest interactive index
    let nearest = -1; let minD = Infinity;
    for (let i = 0; i < interactiveIndices.length; i++) {
      const d = Math.abs(interactiveIndices[i] - idx);
      if (d < minD) { minD = d; nearest = interactiveIndices[i]; }
    }
    if (nearest === -1) return;
    const msgIdx = interactiveIndices.indexOf(nearest) % Math.max(1, loveMessages.length);
    const px = positions[nearest * 3];
    const py = positions[nearest * 3 + 1];
    const pz = positions[nearest * 3 + 2];
    const pos = new THREE.Vector3(px, py, pz);
    if (onMessage) onMessage(msgIdx, pos);
    e.stopPropagation();
  }

  function handlePointerMove(e: any) {
    if (!e.index && e.index !== 0) { setHovered(null); return; }
    const idx = e.index as number;
    // nearest interactive
    let nearest = -1; let minD = Infinity;
    for (let i = 0; i < interactiveIndices.length; i++) {
      const d = Math.abs(interactiveIndices[i] - idx);
      if (d < minD) { minD = d; nearest = interactiveIndices[i]; }
    }
    if (nearest === -1) { setHovered(null); return; }
    setHovered(nearest);
  }

  function handlePointerOut() {
    setHovered(null);
  }

  return (
    <points ref={pointsRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerOut={handlePointerOut}>
      <bufferGeometry>
        <bufferAttribute attachObject={["attributes", "position"]} count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={0xffffff} size={0.7} sizeAttenuation={true} depthWrite={false} transparent opacity={0.85} />
    </points>
  );
}
