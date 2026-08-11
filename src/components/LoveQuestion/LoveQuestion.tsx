import React, { useState, useRef } from "react";
import { useGlobalState } from "../../state/GlobalState";
import { motion } from "framer-motion";
import "../Envelope/Envelope.css";

export default function LoveQuestion({ onYes }: { onYes: () => void }) {
  const { } = useGlobalState();
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const noRef = useRef<HTMLButtonElement | null>(null);

  function moveNoRandomly() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const padding = 40;
    const x = Math.floor(Math.random() * (vw - padding * 2)) - (vw / 2 - padding);
    const y = Math.floor(Math.random() * (vh - padding * 2)) - (vh / 2 - padding);
    setNoPos({ x, y });
  }

  return (
    <div className="mt-6 p-6 bg-white/5 rounded-xl text-center">
      <h3 className="text-2xl font-semibold mb-3">¿Me permites estar en tu corazón?</h3>
      <div className="flex items-center justify-center gap-6 relative" style={{ minHeight: 60 }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onYes()}
          className="px-6 py-3 bg-gold text-black rounded-xl text-lg"
          aria-label="Sí"
        >
          ❤️ Sí
        </motion.button>

        <motion.button
          ref={noRef}
          onMouseEnter={moveNoRandomly}
          onTouchStart={(e) => { e.preventDefault(); moveNoRandomly(); }}
          onClick={() => moveNoRandomly()}
          className="px-6 py-3 bg-white/5 text-warm-white rounded-xl text-lg absolute"
          style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
          aria-label="No"
        >
          No
        </motion.button>
      </div>
    </div>
  );
}
