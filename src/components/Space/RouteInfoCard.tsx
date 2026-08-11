import React from "react";

export default function RouteInfoCard({ originName, destinationName, distanceKm }: { originName: string; destinationName: string; distanceKm: number }) {
  return (
    <div className="mt-4 p-4 bg-gradient-to-b from-black/40 to-black/25 border border-white/5 rounded-xl">
      <div className="text-sm text-warm-white/60">✈ Nuestra distancia</div>
      <div className="mt-3 text-white font-semibold">
        {originName}
      </div>
      <div className="text-gold text-2xl font-bold my-2">{Math.round(distanceKm)} km</div>
      <div className="text-sm text-warm-white/60">{destinationName}</div>
    </div>
  );
}
