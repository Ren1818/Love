import React, { useEffect, useState } from "react";
import MathLock from "../components/MathLock/MathLock";
import RelationshipCounter from "../components/RelationshipCounter/RelationshipCounter";
import MusicPlayer from "../components/Music/MusicPlayer";
import Envelope from "../components/Envelope/Envelope";
import { useGlobalState } from "../state/GlobalState";

export default function LetterScreen({ onEnterSpace }: { onEnterSpace: () => void }) {
  const { envelopeState, setEnvelopeState } = useGlobalState();
  const [solved, setSolved] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);

  useEffect(() => {
    if (solved) {
      // mark unlocked to start animation sequence
      setEnvelopeState("UNLOCKED");
    }
  }, [solved]);

  function handleSolved() {
    setSolved(true);
  }

  function handleFullyOpened() {
    setLetterOpened(true);
    // After opening, advance to love question state
    setEnvelopeState("LOVE_QUESTION");
    // For Phase2 we stop here; in Phase3 we'll show question and music
  }

  return (
    <div className="app-container p-6">
      <div className="max-w-3xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Nuestra Historia ❤️</h1>
          <p className="text-warm-white/70 mt-2">Una experiencia privada y romántica.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <Envelope onFullyOpened={handleFullyOpened} />
          </div>

          <div>
            <MathLock onSolved={handleSolved} />
            <div className="mt-6">
              <RelationshipCounter />
            </div>
          </div>
        </div>

        {letterOpened && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-medium">Carta abierta</h3>
            <div className="mt-3 text-sm text-warm-white/70">Aquí podrás escribir el contenido de la carta más adelante.</div>
          </div>
        )}
      </div>

      <MusicPlayer />
    </div>
  );
}
