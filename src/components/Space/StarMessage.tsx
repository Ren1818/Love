import React from "react";
import { Html } from "@react-three/drei";

export default function StarMessage({ position, message, onClose }: { position: [number, number, number]; message: string; onClose?: () => void }) {
  return (
    <Html position={position} center style={{ pointerEvents: 'auto', zIndex: 100 }}>
      <div className="bg-black/70 text-sm text-warm-white p-3 rounded shadow-lg max-w-xs">
        <div className="font-medium mb-1">{message}</div>
        <div className="text-xs text-warm-white/60 mt-2 text-right">
          <button onClick={() => onClose && onClose()} className="px-2 py-1 bg-white/5 rounded">Cerrar</button>
        </div>
      </div>
    </Html>
  );
}
