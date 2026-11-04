"use client";

import { useEffect, useRef } from "react";
import { clamp, prefersReduced } from "@/lib/motion";

/** A big paragraph whose words light up one by one as you scroll past it. */
export default function WordLight({ text, className = "about__big" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLSpanElement>(".w")];
    const reduced = prefersReduced();
    let ticking = false;
    const update = () => {
      const br = el.getBoundingClientRect();
      const lit = clamp((innerHeight * 0.85 - br.top) / (br.height + innerHeight * 0.35), 0, 1);
      const n = reduced ? spans.length : Math.round(lit * spans.length);
      spans.forEach((w, i) => w.classList.toggle("is-lit", i < n));
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}><span className="w" aria-hidden="true">{w}</span>{i < words.length - 1 ? " " : ""}</span>
      ))}
    </p>
  );
}
