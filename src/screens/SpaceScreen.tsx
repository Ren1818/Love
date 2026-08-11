import React, { useState } from "react";
import SpaceScene from "../components/Space/SpaceScene";
import RelationshipCounter from "../components/RelationshipCounter/RelationshipCounter";
import { calculateDistance } from "../utils/distance";
import { origin, destination } from "../config/locations";
import RouteInfoCard from "../components/Space/RouteInfoCard";

export default function SpaceScreen({ onBack }: { onBack: () => void }) {
  const [showRoute, setShowRoute] = useState(false);

  const distanceKm = calculateDistance(origin, destination);

  return (
    <div className="app-container p-6">
      <div className="max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-sm bg-white/5 px-3 py-2 rounded">Volver</button>
          <h2 className="text-2xl">Nuestro Universo</h2>
          <div />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-transparent rounded-xl h-[560px] flex items-center justify-center">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-black/80 to-[#021024]">
              <SpaceScene showRoute={showRoute} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <RelationshipCounter small />
            <div className="mt-4 text-sm text-warm-white/70">Estrellas y mensajes estarán aquí.</div>
            <div className="mt-4">
              <button onClick={() => setShowRoute((s) => !s)} className="px-3 py-2 rounded bg-gold text-black">{showRoute ? "Ocultar ruta" : "Mostrar ruta"}</button>
            </div>

            {showRoute && (
              <div className="mt-4">
                <RouteInfoCard originName={`${origin.city}, ${origin.country}`} destinationName={`${destination.city}, ${destination.country}`} distanceKm={distanceKm} />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
