import React, { useEffect, useRef, useState, useContext } from "react";
import { music as musicConfig } from "../../config/music";
import { useGlobalState } from "../../state/GlobalState";

type MusicState = {
  playing: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  seek: (t: number) => void;
  fadeTo: (v: number, durationSeconds?: number) => void;
  audioEl: HTMLAudioElement | null;
};

const MusicContext = React.createContext<MusicState | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { envelopeState } = useGlobalState();

  useEffect(() => {
    const a = new Audio(musicConfig.audio);
    a.preload = "auto";
    a.loop = true;
    a.volume = 0; // start muted, fade in when needed
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

  useEffect(() => {
    // react to envelope state: when entering SPACE_TRANSITION or SPACE, start music fade in
    if (!audioRef.current) return;
    if (envelopeState === "SPACE_TRANSITION" || envelopeState === "SPACE") {
      // try to play (may be blocked until user interacts)
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      fadeTo(1, 1.6);
    } else if (envelopeState === "LOCKED" || envelopeState === "UNLOCKED") {
      // fade out softly
      fadeTo(0, 1.2);
    }
  }, [envelopeState]);

  function play() {
    const a = audioRef.current; if (!a) return;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }
  function pause() { const a = audioRef.current; if (!a) return; a.pause(); setPlaying(false); }
  function seek(t: number) { const a = audioRef.current; if (!a) return; a.currentTime = t; }

  function fadeTo(target: number, durationSeconds = 1.0) {
    const a = audioRef.current; if (!a) return;
    const start = a.volume;
    const diff = target - start;
    const startTime = performance.now();
    let raf = 0;
    function step(now: number) {
      const p = Math.min(1, (now - startTime) / (durationSeconds * 1000));
      a.volume = Math.max(0, Math.min(1, start + diff * p));
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        if (a.volume === 0) a.pause();
        if (raf) cancelAnimationFrame(raf);
      }
    }
    // ensure playing when fading in
    if (target > 0) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    raf = requestAnimationFrame(step);
  }

  return (
    <MusicContext.Provider value={{ playing, currentTime, duration, play, pause, seek, fadeTo, audioEl: audioRef.current }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = React.useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}
