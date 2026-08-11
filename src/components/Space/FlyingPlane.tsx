import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function FlyingPlane({ originVec, destVec }: { originVec: THREE.Vector3; destVec: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const path = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 200;
    const p0 = originVec.clone().normalize();
    const p1 = destVec.clone().normalize();
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const v = new THREE.Vector3().copy(p0).lerp(p1, t).normalize();
      const radius = 1 + 0.06 * Math.sin(Math.PI * t);
      points.push(v.multiplyScalar(radius));
    }
    return points;
  }, [originVec, destVec]);

  // time accumulator
  const tRef = useRef(0);

  useFrame((state, delta) => {
    tRef.current += delta * 0.07; // speed
    const len = path.length;
    const idxF = (tRef.current * len) % len;
    const idx = Math.floor(idxF);
    const next = path[(idx + 1) % len];
    const cur = path[idx];
    if (meshRef.current && cur && next) {
      meshRef.current.position.copy(cur);
      // smooth orientation with quaternion slerp
      const target = new THREE.Object3D();
      target.position.copy(next);
      target.lookAt(next);
      const dir = new THREE.Vector3().subVectors(next, cur).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const mat = new THREE.Matrix4();
      mat.lookAt(cur, next, up);
      const quat = new THREE.Quaternion().setFromRotationMatrix(mat);
      meshRef.current.quaternion.slerp(quat, 0.18);
    }
  });

  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[0.02, 0.06, 6]} />
      <meshStandardMaterial color={0xff6b6b} />
    </mesh>
  );
}
