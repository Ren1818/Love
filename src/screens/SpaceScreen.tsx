import React from "react";
import RelationshipCounter from "../components/RelationshipCounter/RelationshipCounter";

export default function SpaceScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="app-container p-6">
      <div className="max-w-5xl w-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-sm bg-white/5 px-3 py-2 rounded">Volver</button>
          <h2 className="text-2xl">Nuestro Universo</h2>
          <div />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/3 rounded-xl h-96 flex items-center justify-center">
            {/* Canvas / Three.js placeholder */}
            <div>Canvas 3D (placeholder)</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <RelationshipCounter small />
            <div className="mt-4 text-sm text-warm-white/70">Estrellas y mensajes estarán aquí.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
