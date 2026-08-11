import React, { useEffect, useState } from "react";
import { relationship } from "../../config/relationship";

function computeDiff(startISO: string) {
  const start = new Date(startISO).getTime();
  const now = Date.now();
  let delta = Math.max(0, now - start) / 1000; // segundos
  const years = Math.floor(delta / (3600 * 24 * 365));
  delta -= years * 3600 * 24 * 365;
  const months = Math.floor(delta / (3600 * 24 * 30));
  delta -= months * 3600 * 24 * 30;
  const days = Math.floor(delta / (3600 * 24));
  delta -= days * 3600 * 24;
  const hours = Math.floor(delta / 3600);
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60);
  const seconds = Math.floor(delta - minutes * 60);
  return { years, months, days, hours, minutes, seconds };
}

export default function RelationshipCounter({ small = false }: { small?: boolean }) {
  const [time, setTime] = useState(() => computeDiff(relationship.startDate));

  useEffect(() => {
    const t = setInterval(() => {
      setTime(computeDiff(relationship.startDate));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={small ? "text-sm" : "text-lg"} aria-live="polite">
      <div className="text-warm-white/70">Juntos desde el<br />15 de julio de 2026</div>
      <div className="mt-2">
        {time.years} años · {time.months} meses · {time.days} días
      </div>
      <div>
        {String(time.hours).padStart(2,"0")} horas · {String(time.minutes).padStart(2,"0")} minutos · {String(time.seconds).padStart(2,"0")} segundos
      </div>
    </div>
  );
}
