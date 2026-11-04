"use client";

import { useEffect, useRef, useState } from "react";
import ImageSlot from "./ImageSlot";
import { images } from "@/lib/site";
import { clamp, setTheme } from "@/lib/motion";

const steps = [
  { time: "03:00", theme: "night",   img: images.shiftMix,      alt: "Hands lifting wet dough from a mixing bowl",  title: "The mix",       text: "Flour, water, salt and a starter older than the shop. The dough has been resting since yesterday afternoon." },
  { time: "04:30", theme: "plum",    img: images.shiftFold,     alt: "Hands folding pastry dough on a floured bench", title: "The fold",    text: "Every loaf is shaped by hand and every croissant is rolled while the butter is still cold." },
  { time: "05:45", theme: "dawn",    img: images.shiftOven,     alt: "Loaves coming out of a stone deck oven",      title: "The oven",      text: "Stone deck, plenty of steam, and a crust taken darker than you'd expect. That is where the flavor lives." },
  { time: "07:00", theme: "morning", img: images.shiftDoors,    alt: "Shelves full of fresh bread in morning light", title: "The doors",    text: "The shelves are full, the coffee is on, and the first regulars are already outside." },
  { time: "14:00", theme: "day",     img: images.shiftLastLoaf, alt: "One last loaf on an empty shelf",             title: "The last loaf", text: "We bake a set amount each day. When it's gone we sweep up, feed the starter and go to bed." },
];
const times = steps.map((s) => { const [h, m] = s.time.split(":").map(Number); return h * 60 + m; });

/** Pinned section: scrolling moves the clock, the sun along its arc, and the page from night to day. */
export default function NightShift() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const shift = sectionRef.current, pin = pinRef.current, arc = arcRef.current, sun = sunRef.current, clock = clockRef.current;
    if (!shift || !pin || !arc || !sun || !clock) return;
    let inside = false, ticking = false, current = 0;
    const update = () => {
      ticking = false;
      const r = shift.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
      const pos = p * (steps.length - 1);
      const idx = Math.round(pos);
      const a = Math.floor(pos), b = Math.min(a + 1, times.length - 1);
      const mins = Math.floor((times[a] + (times[b] - times[a]) * (pos - a)) / 5) * 5;
      clock.textContent = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
      if (idx !== current) { current = idx; setActive(idx); }
      const nowIn = r.top <= innerHeight * 0.5 && r.bottom >= innerHeight * 0.5;
      if (nowIn) setTheme(steps[idx].theme);
      else if (inside && r.top > 0) setTheme("night");
      inside = nowIn;
      const box = arc.ownerSVGElement!.getBoundingClientRect();
      const pt = arc.getPointAtLength(arc.getTotalLength() * p);
      const pr = pin.getBoundingClientRect();
      sun.style.transform = `translate(${box.left - pr.left + (pt.x / 1000) * box.width}px, ${box.top - pr.top + (pt.y / 300) * box.height}px)`;
      if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section className="shift" id="night-shift" ref={sectionRef}>
      <div className="shift__pin" ref={pinRef}>
        <p className="eyebrow">The night shift</p>
        <div className="shift__clock" ref={clockRef} aria-hidden="true">03:00</div>
        <ol className="shift__steps">
          {steps.map((s, i) => (
            <li key={s.time} className={i === active ? "is-active" : ""}>
              <ImageSlot className="shift__img" src={s.img} alt={s.alt} width={1200} height={900} />
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="shift__dots" aria-hidden="true">
          <span className="shift__bar" ref={barRef} />
          {steps.map((s, i) => <i key={s.time} className={i <= active ? "is-on" : ""} />)}
        </div>
        <svg className="shift__arc" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <path ref={arcRef} d="M0 300C250 20 750 20 1000 300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="shift__sun" ref={sunRef} aria-hidden="true" />
      </div>
    </section>
  );
}
