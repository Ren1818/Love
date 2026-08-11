import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import Earth from "./Earth";
import Stars from "./Stars";
import FlightRoute from "./FlightRoute";
import FlyingPlane from "./FlyingPlane";
import Marker from "./Marker";
import { origin, destination } from "../../config/locations";
import { latLonToVector3 } from "../../utils/geo";

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch (e) {
    return false;
  }
}

export default function SpaceScene({ showRoute }: { showRoute: boolean }) {
  const originVec = useMemo(() => latLonToVector3(origin.latitude, origin.longitude, 1), []);
  const destVec = useMemo(() => latLonToVector3(destination.latitude, destination.longitude, 1), []);

  if (!isWebGLAvailable()) {
    return (
      <div className="bg-space-fallback w-full h-full flex items-center justify-center p-6 rounded-xl">
        <div className="text-center">
          <h3 className="text-xl mb-2">Experiencia espacial no disponible</h3>
          <p className="text-sm text-warm-white/60">Tu dispositivo no soporta WebGL. Mostrando fallback elegante.</p>
          <img src="/textures/earth/colormap.png" alt="Tierra" className="mt-4 w-48 mx-auto rounded" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 420 }}>
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 45 }}
        dpr={Math.min(window.devicePixelRatio || 1, 1.5)}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Suspense fallback={<Html center>Loading scene...</Html>}>
          <Stars />
          <Earth />
          {/* Markers always present but labels can be subtle; showRoute controls route and plane */}
          <Marker position={originVec} label={{ line1: `${origin.city}`, line2: origin.country }} />
          <Marker position={destVec} label={{ line1: `${destination.city}`, line2: destination.country }} />

          {showRoute && <FlightRoute originVec={originVec} destVec={destVec} />}
          {showRoute && <FlyingPlane originVec={originVec} destVec={destVec} />}
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={6}
          maxPolarAngle={Math.PI * 0.9}
          minPolarAngle={Math.PI * 0.1}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
