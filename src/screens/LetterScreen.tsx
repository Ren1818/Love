import React from "react";
import MathLock from "../components/MathLock/MathLock";
import RelationshipCounter from "../components/RelationshipCounter/RelationshipCounter";
import MusicPlayer from "../components/Music/MusicPlayer";

export default function LetterScreen({ onEnterSpace }: { onEnterSpace: () => void }) {
  const handleSolved = () => {
    // TODO: trigger seal break animation and later expose the letter
    console.log("solved");
    // For Phase1 we just simulate progression for now
    setTimeout(() => onEnterSpace(), 800);
  };

  return (
    <div className="app-container p-6">
      <div className="max-w-3xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Nuestra Historia ❤️</h1>
          <p className="text-warm-white/70 mt-2">Una experiencia privada y romántica.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            {/* Envelope placeholder */}
            <div className="w-72 h-44 bg-gradient-to-b from-[#2b1f1f] to-[#161214] rounded-xl shadow-2xl flex items-center justify-center">
              <div className="text-warm-white/60">Sobre físico (placeholder)</div>
            </div>
          </div>

          <div>
            <MathLock onSolved={handleSolved} />
            <div className="mt-6">
              <RelationshipCounter />
            </div>
          </div>
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}
