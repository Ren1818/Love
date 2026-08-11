import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Stars component with some interactive points.
 * - count: total number of stars
 * - interactiveCount: how many stars will be interactive (mapped to messages)
 */
export default function Stars({ count = 600, interactiveCount = 8, loveMessages = [], onMessage }: { count?: number; interactiveCount?: number; loveMessages?: string[]; onMessage?: (idx: number, pos: THREE.Vector3) => void }) {
  const pointsRef = useRef<THREE.Points>(null!);
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

  // interactive indices distributed across the buffer
  const interactiveIndices = useMemo(() => {
    const idxs: number[] = [];
    if (interactiveCount <= 0) return idxs;
    const step = Math.floor(count / interactiveCount);
    for (let i = 0; i < interactiveCount; i++) {
      idxs.push(i * step + Math.floor(Math.random() * Math.max(1, step - 1)));
    }
    return idxs;
  }, [count, interactiveCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.size = 0.5 + Math.sin(t * 1.2) * 0.12;
      // slight rotation for parallax
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  // pointer handler to detect clicked star index (Points supports event.index)
  function handlePointerDown(e: any) {
    if (!e.index && e.index !== 0) return;
    const idx = e.index as number;
    // check if idx is one of interactiveIndices (closest)
    // find nearest interactive by distance in index space
    let nearest = -1;
    let minD = Infinity;
    for (let i = 0; i < interactiveIndices.length; i++) {
      const d = Math.abs(interactiveIndices[i] - idx);
      if (d < minD) {
        minD = d; nearest = interactiveIndices[i];
      }
    }
    if (nearest === -1) return;
    // compute message index
    const msgIdx = interactiveIndices.indexOf(nearest) % Math.max(1, loveMessages.length);
    // compute position of that point
    const px = positions[nearest * 3];
    const py = positions[nearest * 3 + 1];
    const pz = positions[nearest * 3 + 2];
    const pos = new THREE.Vector3(px, py, pz);
    if (onMessage) onMessage(msgIdx, pos);
    e.stopPropagation();
  }

  return (
    <points ref={pointsRef} onPointerDown={handlePointerDown} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attachObject={["attributes", "position"]} count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={0xffffff} size={0.7} sizeAttenuation={true} depthWrite={false} transparent opacity={0.85} />
    </points>
  );
}
