import React, { useState } from "react";
import LetterScreen from "./screens/LetterScreen";
import SpaceScreen from "./screens/SpaceScreen";
import { MusicProvider } from "./components/Music/useMusicPlayer";
import { GlobalStateProvider } from "./state/GlobalState";

export default function App() {
  const [screen, setScreen] = useState<"letter" | "space">("letter");

  return (
    <GlobalStateProvider>
      <MusicProvider>
        {screen === "letter" ? (
          <LetterScreen onEnterSpace={() => setScreen("space")} />
        ) : (
          <SpaceScreen onBack={() => setScreen("letter")} />
        )}
      </MusicProvider>
    </GlobalStateProvider>
  );
}
