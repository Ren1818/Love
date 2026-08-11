import React, { useEffect, useRef, useState } from "react";
import SpaceScene from "../components/Space/SpaceScene";
import RelationshipCounter from "../components/RelationshipCounter/RelationshipCounter";
import { calculateDistance } from "../utils/distance";
import { origin, destination } from "../config/locations";
import RouteInfoCard from "../components/Space/RouteInfoCard";
import StarList from "../components/Space/StarList";
import { loveMessages } from "../config/messages";
import { useMusic } from "../components/Music/useMusicPlayer";

export default function SpaceScreen({ onBack }: { onBack: () => void }) {
  const [showRoute, setShowRoute] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const music = useMusic();

  const distanceKm = calculateDistance(origin, destination);

  useEffect(() => {
    if (modalMessage) {
      // focus close button when modal opens after a tick
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [modalMessage]);

  function handleStarSelectFromScene(idx: number, pos: any) {
    setModalMessage(loveMessages[idx] || null);
  }

  function handleToggleRoute() {
    setShowRoute((s) => {
      const next = !s;
      // when going to show route, gently ensure music is playing (fade handled in provider)
      if (next) {
        music.fadeTo(1, 1.2);
      }
      return next;
    });
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
              <SpaceScene showRoute={showRoute} onToggleRoute={handleToggleRoute} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <RelationshipCounter small />
            <div className="mt-4 text-sm text-warm-white/70">Estrellas y mensajes</div>
            <div className="mt-4">
              <button onClick={() => handleToggleRoute()} className="px-3 py-2 rounded bg-gold text-black">{showRoute ? "Ocultar ruta" : "Mostrar ruta"}</button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label="Recuerdo">
            <div className="bg-black/80 p-6 rounded-xl max-w-lg w-full">
              <div className="text-white">{modalMessage}</div>
              <div className="mt-4 text-right">
                <button ref={closeBtnRef} onClick={() => setModalMessage(null)} className="px-3 py-2 bg-white/5 rounded">Cerrar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
