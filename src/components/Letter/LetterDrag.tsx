import React, { useEffect, useRef, useState } from "react";
import "./Letter.css";

export default function LetterDrag({ onOpened }: { onOpened: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onPointerDown(e: PointerEvent) {
      (e.target as Element).setPointerCapture(e.pointerId);
      dragging.current = true;
      startY.current = e.clientY;
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging.current) return;
      currentY.current = e.clientY;
      const delta = startY.current - currentY.current; // pulling up
      const h = el.parentElement?.clientHeight || 200;
      const p = Math.max(0, Math.min(1, delta / h));
      setProgress(p);
      el.style.transform = `translateY(${-p * 120}px)`;
    }

    function onPointerUp(e: PointerEvent) {
      dragging.current = false;
      const p = progress;
      if (p > 0.7) {
        // complete extraction
        el.style.transition = "transform 0.6s cubic-bezier(.2,.9,.2,1)";
        el.style.transform = `translateY(${-200}px)`;
        setTimeout(() => onOpened(), 650);
      } else {
        // revert
        el.style.transition = "transform 0.45s cubic-bezier(.2,.9,.2,1)";
        el.style.transform = `translateY(0px)`;
        setProgress(0);
      }
    }

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [progress, onOpened]);

  return (
    <div className="letter-card" ref={ref} role="button" tabIndex={0} aria-label="Arrastra la carta hacia afuera">
      <div className="letter-fold"> 
        <div className="letter-inner">
          <div className="letter-placeholder">AQUÍ ESCRIBIRÉ PERSONALMENTE MI CARTA.</div>
        </div>
      </div>
    </div>
  );
}
