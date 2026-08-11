import React, { useState } from "react";
import SpaceScene from "../components/Space/SpaceScene";
import RelationshipCounter from "../components/RelationshipCounter/RelationshipCounter";
import { calculateDistance } from "../utils/distance";
import { origin, destination } from "../config/locations";
import RouteInfoCard from "../components/Space/RouteInfoCard";
import StarList from "../components/Space/StarList";
import { loveMessages } from "../config/messages";

export default function SpaceScreen({ onBack }: { onBack: () => void }) {
  const [showRoute, setShowRoute] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const distanceKm = calculateDistance(origin, destination);

  function handleStarSelectFromScene(idx: number, pos: any) {
    setModalMessage(loveMessages[idx] || null);
    // mark viewed in localStorage via util in scene if desired
  }

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
              <SpaceScene showRoute={showRoute} onToggleRoute={() => setShowRoute(s => !s)} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <RelationshipCounter small />
            <div className="mt-4 text-sm text-warm-white/70">Estrellas y mensajes</div>
            <div className="mt-4">
              <button onClick={() => setShowRoute((s) => !s)} className="px-3 py-2 rounded bg-gold text-black">{showRoute ? "Ocultar ruta" : "Mostrar ruta"}</button>
            </div>

            {showRoute && (
              <div className="mt-4">
                <RouteInfoCard originName={`${origin.city}, ${origin.country}`} destinationName={`${destination.city}, ${destination.country}`} distanceKm={distanceKm} />
              </div>
            )}

            <StarList messages={loveMessages} onSelect={(i) => setModalMessage(loveMessages[i])} />

          </div>
        </div>

        {modalMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="bg-black/80 p-6 rounded-xl max-w-lg w-full">
              <div className="text-white">{modalMessage}</div>
              <div className="mt-4 text-right">
                <button onClick={() => setModalMessage(null)} className="px-3 py-2 bg-white/5 rounded">Cerrar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
