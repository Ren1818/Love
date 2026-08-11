import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { CatmullRomCurve3 } from "three";
import { useFrame } from "@react-three/fiber";

export default function FlightRoute({ originVec, destVec, routeHeight = 0.08, animate = false, duration = 3 }: { originVec: THREE.Vector3; destVec: THREE.Vector3; routeHeight?: number; animate?: boolean; duration?: number }) {
  const curveRef = useRef<CatmullRomCurve3 | null>(null);
  const lineRef = useRef<THREE.Line>(null!);
  const startTimeRef = useRef<number | null>(null);

  const points = useMemo(() => {
    const p0 = originVec.clone().normalize();
    const p1 = destVec.clone().normalize();
    const arcPoints: THREE.Vector3[] = [];

    const segments = 160;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const v = new THREE.Vector3().copy(p0).lerp(p1, t).normalize();
      const radius = 1 + routeHeight * Math.sin(Math.PI * t);
      arcPoints.push(v.multiplyScalar(radius));
    }
    return arcPoints;
  }, [originVec, destVec, routeHeight]);

  useEffect(() => {
    curveRef.current = new CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 2);
    if (lineRef.current) {
      lineRef.current.geometry && lineRef.current.geometry.dispose();
      lineRef.current.geometry = geometry;
    }
    return () => {
      geometry.dispose();
    };
  }, [points]);

  useEffect(() => {
    if (animate) {
      startTimeRef.current = null; // reset to start anim
    } else {
      // show full when not animating
      if (lineRef.current) lineRef.current.geometry.setDrawRange(0, points.length);
    }
  }, [animate]);

  useFrame(({ clock }) => {
    const geom = lineRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (!geom) return;
    if (!animate) return;
    const now = clock.getElapsedTime();
    if (startTimeRef.current === null) startTimeRef.current = now;
    const elapsed = now - (startTimeRef.current || 0);
    const progress = Math.min(1, elapsed / Math.max(0.001, duration));
    const count = Math.floor(points.length * progress);
    geom.setDrawRange(0, Math.max(2, count));
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={0xffd27f} linewidth={2} transparent opacity={0.95} />
    </line>
  );
}
