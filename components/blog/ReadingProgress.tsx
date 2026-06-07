"use client";

import { useEffect, useState } from "react";

/** Barre de progression de lecture fine dorée, fixée en haut. */
export default function ReadingProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setWidth(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
      <div
        className="h-full bg-[#C5A04E] transition-[width] duration-75"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
