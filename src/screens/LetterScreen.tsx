import React, { useState } from "react";
import MathLock from "../components/MathLock/MathLock";
import RelationshipCounter from "../components/RelationshipCounter/RelationshipCounter";
import MusicPlayer from "../components/Music/MusicPlayer";
import Envelope from "../components/Envelope/Envelope";
import LoveQuestion from "../components/LoveQuestion/LoveQuestion";
import LetterFull from "../components/Letter/Letter";
import { useGlobalState } from "../state/GlobalState";

export default function LetterScreen({ onEnterSpace }: { onEnterSpace: () => void }) {
  const { envelopeState, setEnvelopeState } = useGlobalState();
  const [solved, setSolved] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);

  function handleSolved() {
    setSolved(true);
  }

  function handleFullyOpened() {
    setLetterOpened(true);
    setEnvelopeState("LOVE_QUESTION");
  }

  function handleYes() {
    // cinematic transition
    setEnvelopeState("SPACE_TRANSITION");
    // delay then enter space
    setTimeout(() => {
      setEnvelopeState("SPACE");
      onEnterSpace();
    }, 900);
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

        {envelopeState === "LOVE_QUESTION" && (
          <div className="mt-6">
            <LoveQuestion onYes={handleYes} />
          </div>
        )}

        {showFullLetter && (
          <LetterFull onClose={() => setShowFullLetter(false)} />
        )}

      </div>

      <MusicPlayer />
    </div>
  );
}
