"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import BranchMap from "./BranchMap";
import { branches, directionsUrl } from "@/lib/site";
import { clamp, prefersReduced } from "@/lib/motion";

const numbered = branches.map((b, i) => ({ ...b, n: i + 1 }));

/** Pinned scroll story: the map stays put while you scroll from one shop to the next. */
export default function BranchStory() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sec = section.current, tr = track.current;
    if (!sec || !tr || prefersReduced()) return;
    let ticking = false, cur = 0;
    const update = () => {
      ticking = false;
      const r = sec.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
      const pos = p * (numbered.length - 1);
      tr.style.transform = `translateX(calc(${-pos} * (var(--card-w) + var(--card-gap))))`;
      const idx = Math.round(pos);
      if (idx !== cur) { cur = idx; setActive(idx); }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);

  const goTo = (i: number) => {
    const sec = section.current!;
    const total = sec.offsetHeight - innerHeight;
    scrollTo({ top: sec.getBoundingClientRect().top + scrollY + (total * i) / (numbered.length - 1) + 2, behavior: "smooth" });
  };

  return (
    <section className="bs" ref={section} data-theme-section="plum" style={{ "--n": numbered.length } as React.CSSProperties} aria-labelledby="bs-title">
      <div className="bs__pin">
        <div className="bs__head">
          <p className="eyebrow">Where we bake</p>
          <h2 id="bs-title" className="bs__title">{numbered.length} shops, <em>one night shift.</em></h2>
          <div className="bs__dots" role="tablist" aria-label="Choose a shop">
            {numbered.map((b, i) => (
              <button key={b.id} type="button" role="tab" aria-selected={i === active} className={i === active ? "is-on" : ""} onClick={() => goTo(i)}>
                <span>{String(b.n).padStart(2, "0")}</span> {b.name}
              </button>
            ))}
          </div>
        </div>
        <div className="bs__stage">
          <BranchMap branches={numbered} active={numbered[active].id} onPin={(id) => { const i = numbered.findIndex((b) => b.id === id); if (i >= 0 && i !== active) goTo(i); }} label="Map of our shops" />
          <div className="bs__viewport">
            <div className="bs__track" ref={track}>
              {numbered.map((b, i) => (
                <article key={b.id} className={`bs__card${i === active ? " is-on" : ""}`} aria-hidden={i !== active}>
                  <div className="bs__img"><img src={b.img} alt="" loading="lazy" /></div>
                  <div className="bs__info">
                    <span className="bs__n">{String(b.n).padStart(2, "0")}</span>
                    <h3>{b.name}</h3>
                    <p className="bs__area">{b.area}</p>
                    <p>{b.note}</p>
                    <a className="text-link" href={directionsUrl(b)} target="_blank" rel="noopener noreferrer" tabIndex={i === active ? 0 : -1}>Get directions <span aria-hidden="true">→</span></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
