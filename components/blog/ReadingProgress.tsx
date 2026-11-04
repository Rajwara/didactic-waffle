"use client";

import { useEffect, useRef } from "react";

/** A small loaf-colored bar under the nav that fills as you read the article. */
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const article = document.getElementById("article");
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!article || !bar.current) return;
      const r = article.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.4 - r.top) / Math.max(1, r.height - innerHeight * 0.4)));
      bar.current.style.transform = `scaleX(${p})`;
      bar.current.parentElement!.classList.toggle("is-on", r.top < innerHeight * 0.6 && r.bottom > 0);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return <div className="jr-progress" aria-hidden="true"><div ref={bar} /></div>;
}
