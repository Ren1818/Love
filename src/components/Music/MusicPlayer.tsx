import React from "react";
import { useMusic } from "./useMusicPlayer";

export default function MusicPlayerSmall() {
  const { playing, currentTime, duration, play, pause } = useMusic();

  function toggle() { if (playing) pause(); else play(); }

  return (
    <div className="fixed bottom-6 right-6 bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
      <div className="w-12 h-12 bg-black/40 rounded overflow-hidden">
        {/* cover placeholder */}
      </div>
      <div className="min-w-[160px]">
        <div className="text-sm">NOMBRE DE LA CANCIÓN</div>
        <div className="text-xs text-warm-white/60">ARTISTA</div>
        <div className="text-xs mt-1">{formatTime(currentTime)} / {formatTime(duration)}</div>
      </div>
      <button onClick={toggle} aria-label="play-pause" className="px-3 py-2 bg-gold text-black rounded">{playing ? "Pause" : "Play"}</button>
    </div>
  );
}

function formatTime(t: number) {
  if (!t || !isFinite(t)) return "0:00";
  const m = Math.floor(t/60);
  const s = Math.floor(t%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
