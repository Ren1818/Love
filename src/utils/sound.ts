import React, { useEffect } from "react";

export async function playSoundIfExists(src: string) {
  try {
    // test if file exists by fetching its head
    const res = await fetch(src, { method: "HEAD" });
    if (!res.ok) return;
    const a = new Audio(src);
    await a.play().catch(() => {});
  } catch (e) {
    // fail silently if file not present or blocked by autoplay
    return;
  }
}
