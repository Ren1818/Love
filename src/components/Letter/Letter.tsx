import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { letterContent } from "../../config/letter";
import "./Letter.css";

export default function LetterFull({ onClose }: { onClose?: () => void }) {
  const [unfolded, setUnfolded] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // unfold after mount
    const t = setTimeout(() => setUnfolded(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="letter-full fixed inset-0 flex items-center justify-center p-6 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-xl bg-white/95 rounded-xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
      >
        <div className="p-6">
          <div className="text-right">
            <button onClick={() => onClose && onClose()} className="text-sm px-3 py-1 rounded bg-white/10">Cerrar</button>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-black">Carta</h3>
            <div className="mt-3 text-black/80 whitespace-pre-wrap" aria-label="contenido de la carta">
              {letterContent}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
