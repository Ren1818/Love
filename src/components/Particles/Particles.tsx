import React, { useEffect, useRef } from "react";

/**
 * Simple canvas particle burst for subtle effects.
 * Triggered by changing the `key` prop (incrementing number).
 */
export default function Particles({ keyTrigger = 0 }: { keyTrigger?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = canvas.clientWidth * devicePixelRatio;
    let H = canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    let particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string }[] = [];

    function spawn() {
      const cx = canvas.clientWidth / 2;
      const cy = canvas.clientHeight / 2;
      const count = 22;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 3.2;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: 1 + Math.random() * 3,
          color: `rgba(201,168,77,${0.9 - Math.random() * 0.5})`
        });
      }
    }

    function resize() {
      W = canvas.width = canvas.clientWidth * devicePixelRatio;
      H = canvas.height = canvas.clientHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function step() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravity subtle
        p.alpha -= 0.01;
        if (p.alpha <= 0) particles.splice(i, 1);
        ctx.beginPath();
        ctx.fillStyle = p.color.replace(/[^,]+\)$/, `${p.alpha})`);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(step);
    }

    spawn();
    rafRef.current = requestAnimationFrame(step);

    function onResize() {
      resize();
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [keyTrigger]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", width: "100%", height: "100%", zIndex: 60 }} />;
}
