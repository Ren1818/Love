import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { music as musicConfig } from "../../config/music";

type MusicState = {
  playing: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  seek: (t: number) => void;
  audioEl: HTMLAudioElement | null;
};

const MusicContext = createContext<MusicState | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = new Audio(musicConfig.audio);
    a.preload = "auto";
    a.loop = false;
    audioRef.current = a;

    const onTime = () => setCurrentTime(a.currentTime);
    const onDur = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onDur);
    a.addEventListener("ended", onEnd);

    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onDur);
      a.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, []);

  const play = () => {
    const a = audioRef.current; if (!a) return;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const pause = () => { const a = audioRef.current; if (!a) return; a.pause(); setPlaying(false); };
  const seek = (t: number) => { const a = audioRef.current; if (!a) return; a.currentTime = t; };

  return (
    <MusicContext.Provider value={{ playing, currentTime, duration, play, pause, seek, audioEl: audioRef.current }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}
