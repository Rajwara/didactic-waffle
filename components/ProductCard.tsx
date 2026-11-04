"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImageSlot from "./ImageSlot";
import AddButton from "./AddButton";
import { money, type Product } from "@/lib/site";
import { canHover, clamp, onReady, prefersReduced } from "@/lib/motion";

export default function ProductCard({ p, index, hidden = false }: { p: Product; index: number; hidden?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Scroll reveal (handled here because React owns this element's class list)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    const stop = onReady(() => {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setInView(true); io?.disconnect(); }
      }, { threshold: 0.12 });
      io.observe(el);
    });
    return () => { stop(); io?.disconnect(); };
  }, []);

  // A filter change brings a card straight in
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current && !hidden) setInView(true);
    mounted.current = true;
  }, [hidden]);

  // Hover: 3D tilt with a light glare that follows the pointer
  useEffect(() => {
    const card = ref.current, tile = tileRef.current;
    if (!card || !tile || prefersReduced() || !canHover()) return;
    const move = (e: PointerEvent) => {
      const r = tile.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5);
      const y = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);
      tile.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
      tile.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
      tile.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
    };
    const leave = () => { tile.style.transform = ""; };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <article
      ref={ref}
      className={`card reveal${inView ? " is-in" : ""}${hidden ? " is-out" : ""}`}
      data-cat={p.cat}
      style={{ "--d": `${(index % 4) * 0.07}s` } as React.CSSProperties}
    >
      <Link className="card__link" href={`/menu/${p.id}`}>
        <div className="card__tile" ref={tileRef}>
          <ImageSlot src={p.img} alt={p.name} width={1200} height={1200} className="card__img">
            <span className="card__peek" aria-hidden="true">View details →</span>
          </ImageSlot>
          <span className="card__glare" aria-hidden="true" />
        </div>
        <div className="card__row"><h3>{p.name}</h3><span>{money(p.price)}</span></div>
        <p className="card__note">{p.note}</p>
      </Link>
      <AddButton id={p.id} label={p.name} className="card__add" />
    </article>
  );
}
