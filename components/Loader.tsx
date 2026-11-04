"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { clamp, markReady, prefersReduced, store } from "@/lib/motion";

const SEEN_KEY = "didacticWaffleSeen";
const MIN_MS = 2100; // long enough to enjoy, short enough not to annoy

/** Runs before React hydrates so returning visitors never see a flash of the loader. */
export const loaderBootScript = `(function(){try{var d=document.documentElement;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('${SEEN_KEY}')){d.classList.add('dw-skip');}else{d.classList.add('dw-loading');}}catch(e){document.documentElement.classList.add('dw-loading');}})();`;

const CELLS = 16;

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState<"run" | "exit" | "gone">("run");
  const pageLoaded = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("dw-skip") || prefersReduced() || store.get("sessionStorage", SEEN_KEY)) {
      root.classList.remove("dw-loading");
      setStage("gone");
      markReady();
      return;
    }
    store.set("sessionStorage", SEEN_KEY, "1");

    const onLoad = () => { pageLoaded.current = true; };
    if (document.readyState === "complete") onLoad();
    else addEventListener("load", onLoad, { once: true });

    const begin = performance.now();
    let raf = 0, shown = 0, done = false;
    const tick = (t: number) => {
      const time = clamp((t - begin) / MIN_MS, 0, 1);
      // Time drives the bar to 90%, the real page load unlocks the last 10%
      const eased = 1 - Math.pow(1 - time, 3);
      const target = pageLoaded.current ? eased * 100 : Math.min(eased * 100, 90);
      shown += (target - shown) * 0.18;
      if (target >= 100 && shown > 99.5) shown = 100;
      setPct(Math.round(shown));
      if (shown >= 100 && !done) {
        done = true;
        setTimeout(() => {
          setStage("exit");
          root.classList.remove("dw-loading");
          markReady();
          setTimeout(() => setStage("gone"), 1300);
        }, 260);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener("load", onLoad); };
  }, []);

  if (stage === "gone") return null;

  const lit = Math.round((pct / 100) * CELLS);
  const minutes = Math.round(180 + 240 * (pct / 100)); // 03:00 to 07:00
  const clock = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

  return (
    <div className={`loader${stage === "exit" ? " is-done" : ""}`} aria-hidden="true">
      <div className="loader__back" />
      <div className="loader__panel">
        <div className="loader__stars">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%`, "--t": `${(i % 7) * 0.4}s` } as React.CSSProperties} />
          ))}
        </div>

        <div className="loader__waffle">
          {Array.from({ length: CELLS }, (_, i) => (
            <span key={i} className={i < lit ? "is-lit" : ""} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>

        <p className="loader__name">
          <span className="loader__word">
            {site.first.split("").map((c, i) => (
              <span key={i} className="loader__char" style={{ "--i": i } as React.CSSProperties}>{c}</span>
            ))}
          </span>
          <em className="loader__word">
            {site.second.split("").map((c, i) => (
              <span key={i} className="loader__char" style={{ "--i": i + site.first.length + 1 } as React.CSSProperties}>{c}</span>
            ))}
          </em>
        </p>

        <div className="loader__meta">
          <span className="loader__note">The ovens are warming</span>
          <span className="loader__clock">{clock}</span>
        </div>
        <div className="loader__bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
        <span className="loader__pct">{String(pct).padStart(3, "0")}%</span>
      </div>
    </div>
  );
}
