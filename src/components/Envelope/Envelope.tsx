import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Seal from "./Seal";
import "./Envelope.css";
import LetterDrag from "../Letter/LetterDrag";
import { useGlobalState } from "../../state/GlobalState";

export default function Envelope({ onFullyOpened }: { onFullyOpened?: () => void }) {
  const { envelopeState, setEnvelopeState } = useGlobalState();
  const controls = useAnimation();
  const [showLetter, setShowLetter] = useState(false);
  const envelopeRef = useRef<HTMLDivElement | null>(null);

  // When state changes to UNLOCKED -> start seal breaking sequence
  useEffect(() => {
    if (envelopeState === "UNLOCKED") {
      (async () => {
        setEnvelopeState("SEAL_BREAKING");
        // glow
        await controls.start({ boxShadow: "0 12px 40px rgba(201,168,77,0.25)", transition: { duration: 0.6 } });
        // seal vibrate
        await controls.start({ y: [0, -4, 3, -2, 1, 0], transition: { duration: 0.8 } });
        // crack (we simulate by scaling/opacity on Seal component via prop)
        setShowLetter(true); // reveal partially
        // small particles could be triggered here (placeholder)
        await controls.start({ rotateX: -6, transition: { duration: 0.6 } });
        // open envelope flap
        setEnvelopeState("ENVELOPE_OPEN");
      })();
    }
  }, [envelopeState]);

  function handleLetterExtracted() {
    setEnvelopeState("LETTER_OPEN");
    if (onFullyOpened) onFullyOpened();
  }

  return (
    <div className="envelope-stage">
      <motion.div className="envelope" animate={controls} ref={envelopeRef}>
        <div className="envelope-body">
          <div className={`envelope-flap ${envelopeState === "ENVELOPE_OPEN" ? "open" : ""}`} />
          <div className="envelope-inner">
            {/* partially visible letter */}
            <div className={`letter-peek ${showLetter ? "visible" : ""}`}>
              <LetterDrag onOpened={handleLetterExtracted} />
            </div>
          </div>
          <div className="seal-wrapper">
            <Seal cracked={envelopeState === "SEAL_BREAKING" || showLetter} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
