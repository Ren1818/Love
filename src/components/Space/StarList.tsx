import React from "react";

export default function StarList({ messages, onSelect }: { messages: string[]; onSelect?: (idx: number) => void }) {
  return (
    <div className="mt-6">
      <div className="text-sm text-warm-white/70 mb-2">Recuerdos</div>
      <div className="grid gap-2">
        {messages.map((m, i) => (
          <button key={i} onClick={() => onSelect && onSelect(i)} className="text-left px-3 py-2 bg-black/40 rounded hover:bg-black/30">
            <div className="font-medium">Recuerdo {i + 1}</div>
            <div className="text-xs text-warm-white/60 truncate max-w-[220px]">{m}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
