"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageSlot from "./ImageSlot";
import { images } from "@/lib/site";

type Star = { left: string; top: string; t: string; s: number };

export default function Hero() {
  const [stars, setStars] = useState<Star[]>([]);
  const [status, setStatus] = useState("");

  // Random bits are made on the client so server and browser markup match
  useEffect(() => {
    setStars(Array.from({ length: 70 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      t: `${Math.random() * 3.5}s`,
      s: Math.random() < 0.15 ? 4 : Math.random() < 0.5 ? 3 : 2,
    })));
    const now = new Date();
    setStatus(now.getDay() !== 1 && now.getHours() >= 7 && now.getHours() < 14
      ? "Open now, until sold out" : "Baking soon, doors at 7am");
  }, []);

  return (
    <section className="hero" data-theme-section="night">
      <div className="hero__stars" aria-hidden="true">
        {stars.map((s, i) => (
          <i key={i} style={{ left: s.left, top: s.top, width: s.s, height: s.s, "--t": s.t } as React.CSSProperties} />
        ))}
        <span className="hero__shooting" />
      </div>
      <div className="hero__glow" aria-hidden="true" />
      <ImageSlot
        id="heroLoaf"
        className="hero__loaf"
        src={images.hero}
        alt="Round dark-crusted sourdough loaf, seen from above"
        width={1200}
        height={1200}
        priority
      />
      <h1 className="hero__title">
        <span className="line"><span>Baked</span></span>
        <span className="line"><span><em>while</em> you</span></span>
        <span className="line"><span>slept.</span></span>
      </h1>
      <div className="hero__foot">
        <p className="reveal">We start when the street goes quiet. Slow-fermented bread and pastry, out of the oven by morning and gone by afternoon.</p>
        <div className="hero__cta reveal" style={{ "--d": ".1s" } as React.CSSProperties}>
          <Link className="btn magnetic" href="/menu"><span>See today&apos;s menu</span></Link>
          <span className="hero__status">{status}</span>
        </div>
      </div>
    </section>
  );
}
