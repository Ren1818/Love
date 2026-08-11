import React, { createContext, useContext, useState } from "react";

export type EnvelopeState =
  | "LOCKED"
  | "SOLVING"
  | "UNLOCKED"
  | "SEAL_BREAKING"
  | "ENVELOPE_OPEN"
  | "LETTER_DRAGGING"
  | "LETTER_OPEN"
  | "LOVE_QUESTION"
  | "SPACE_TRANSITION"
  | "SPACE";

type GlobalState = {
  envelopeState: EnvelopeState;
  setEnvelopeState: (s: EnvelopeState) => void;
};

const GlobalStateContext = createContext<GlobalState | null>(null);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [envelopeState, setEnvelopeState] = useState<EnvelopeState>("LOCKED");

  return (
    <GlobalStateContext.Provider value={{ envelopeState, setEnvelopeState }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const ctx = useContext(GlobalStateContext);
  if (!ctx) throw new Error("useGlobalState must be used within GlobalStateProvider");
  return ctx;
}
