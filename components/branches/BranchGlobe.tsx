"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { branches, directionsUrl, type Branch } from "@/lib/site";
import { clamp } from "@/lib/motion";

/* The globe is drawn in a 1000-unit box. The active shop is panned to FOCUS. */
const FOCUS = { x: 500, y: 290 };
const SPREAD = 440; // how far apart the shops sit on the globe, in globe units

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Shops placed on the globe from their coordinates, centred on the 1000-unit box. */
function placeShops(list: Branch[]) {
  const lats = list.map((b) => b.lat), lngs = list.map((b) => b.lng);
  const cLat = (Math.min(...lats) + Math.max(...lats)) / 2, cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs), 0.005);
  return list.map((b) => ({ x: 500 + ((b.lng - cLng) / span) * SPREAD, y: 500 - ((b.lat - cLat) / span) * SPREAD }));
}

/** Deterministic wobbly blob, used for the landmass. */
function blob(cx: number, cy: number, r: number, seed: number, n = 48) {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.16 * Math.sin(a * 3 + seed) + 0.09 * Math.sin(a * 7 + seed * 2) + 0.05 * Math.sin(a * 13 + seed * 3);
    pts.push(`${(cx + Math.cos(a) * r * k).toFixed(1)},${(cy + Math.sin(a) * r * k * 0.82).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

/** Curved graticule over a large area, so it still covers the globe while panning. */
function graticule() {
  let d = "";
  for (let x = -1400; x <= 2400; x += 110) {
    const bend = (x - 500) * 0.08;
    d += `M${x},-1400Q${x + bend},500 ${x},2400`;
  }
  for (let y = -1400; y <= 2400; y += 110) d += `M-1400,${y}Q500,${y - 60} 2400,${y}`;
  return d;
}

export default function BranchGlobe() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const layer = useRef<SVGGElement>(null);
  const pinsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<{ i: number; x: number; y: number; flip: boolean } | null>(null);
  const [reduced, setReduced] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const [cardHover, setCardHover] = useState<number | null>(null);

  const points = useMemo(() => placeShops(branches), []);
  const art = useMemo(() => ({
    grid: graticule(),
    land: blob(500, 500, 430, 1.3),
    isle: blob(1080, -60, 130, 4.1, 32),
    isle2: blob(-60, 1060, 110, 2.2, 32),
    river: `M-600,${points[0].y + 260} C 100,${points[0].y + 120} 300,${points[0].y + 380} 560,${points[0].y + 250} S 1100,${points[0].y + 60} 1700,${points[0].y + 200}`,
    streets: points.map((p, i) => `M${p.x - 160},${p.y + (i % 2 ? 40 : -30)}L${p.x + 160},${p.y + (i % 2 ? -40 : 30)}M${p.x + (i % 2 ? -30 : 30)},${p.y - 150}L${p.x + (i % 2 ? 40 : -40)},${p.y + 150}`).join(""),
  }), [points]);

  const hits = useMemo(() => {
    const n = norm(query);
    if (!n) return [];
    return branches.map((b, i) => ({ b, i })).filter(({ b }) => norm(`${b.name} ${b.area} ${b.address}`).includes(n));
  }, [query]);

  /* Pinned scroll: progress pans the globe and slides the cards */
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;
    const sec = section.current!, row = track.current!;
    let distance = 0, raf = 0, running = false;
    const cur = { p: 0 }, tgt = { p: 0 };

    const measure = () => {
      distance = Math.max(0, row.scrollWidth - document.documentElement.clientWidth);
      // With only a few shops the row may fit on screen, so give each shop some scroll of its own too
      const travel = Math.max(distance, (points.length - 1) * innerHeight * 0.55);
      sec.style.height = `${innerHeight + travel + innerHeight * 0.35}px`;
      onScroll();
    };
    const focusFor = (p: number) => {
      const f = p * (points.length - 1), i = Math.floor(f), t = f - i;
      const a = points[i], b = points[Math.min(i + 1, points.length - 1)];
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    };
    const draw = () => {
      const f = focusFor(cur.p);
      const tx = FOCUS.x - f.x, ty = FOCUS.y - f.y;
      layer.current?.setAttribute("transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`);
      if (pinsRef.current) pinsRef.current.style.transform = `translate(${(tx / 10).toFixed(3)}%, ${(ty / 10).toFixed(3)}%)`;
      row.style.transform = `translate3d(${(-cur.p * distance).toFixed(1)}px,0,0)`;
      setActive(Math.round(cur.p * (points.length - 1)));
    };
    const tick = () => {
      const d = tgt.p - cur.p;
      cur.p = Math.abs(d) < 0.0005 ? tgt.p : cur.p + d * 0.12;
      draw();
      if (cur.p !== tgt.p) raf = requestAnimationFrame(tick);
      else running = false;
    };
    function onScroll() {
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - innerHeight;
      tgt.p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    }
    measure();
    cur.p = tgt.p;
    draw();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", measure); cancelAnimationFrame(raf); sec.style.height = ""; };
  }, [points]);

  const goTo = (i: number) => {
    const sec = section.current!;
    if (reduced) { track.current?.children[i]?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" }); setActive(i); return; }
    const total = sec.offsetHeight - innerHeight;
    scrollTo({ top: sec.getBoundingClientRect().top + scrollY + (total * i) / (points.length - 1), behavior: "smooth" });
  };
  const pick = (i: number) => { setOpen(false); setQuery(branches[i].name); goTo(i); };

  const onPinMove = (i: number) => (e: React.PointerEvent) => {
    const r = section.current!.querySelector(".bg-sticky")!.getBoundingClientRect();
    const x = e.clientX - r.left;
    setHover({ i, x, y: e.clientY - r.top, flip: r.width - x < 280 });
  };
  const hovered = hover ? branches[hover.i] : null;

  return (
    <section ref={section} className={`bg-story${reduced ? " is-static" : ""}`} data-theme-section="night" aria-labelledby="bg-title">
      <div className="bg-sticky">
        <div className="bg-head">
          <p className="eyebrow">Where we bake</p>
          <h2 className="bg-title" id="bg-title">{branches.length} shops, <em>one night shift.</em></h2>
          <form
            className="bg-search"
            role="search"
            onSubmit={(e) => { e.preventDefault(); const h = hits[sel] ?? hits[0]; if (h) pick(h.i); }}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setSel(0); }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Search a shop or area"
              aria-label="Search shops"
              role="combobox"
              aria-expanded={open && query.trim().length > 0}
              aria-controls="bg-search-list"
              aria-autocomplete="list"
            />
            <button type="submit">Search</button>
            {open && query.trim() && (
              <div className="bg-search-list" id="bg-search-list" role="listbox">
                {hits.length ? (
                  <>
                    <span className="bg-search-title">{hits.length} {hits.length === 1 ? "shop" : "shops"}</span>
                    {hits.map(({ b, i }, n) => (
                      <button type="button" role="option" aria-selected={n === sel} key={b.id} className={n === sel ? "on" : undefined}
                        onMouseEnter={() => setSel(n)} onClick={() => pick(i)}>
                        <span className="bg-search-n">{String(i + 1).padStart(2, "0")}</span>
                        <span><b>{b.name}</b><small>{b.area} · {b.address}</small></span>
                      </button>
                    ))}
                  </>
                ) : (
                  <span className="bg-search-empty">No shop found for “{query}”. Try another area, or <a href="#find">use the shop finder</a>.</span>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="bg-globe">
          <svg viewBox="0 0 1000 1000" aria-hidden="true">
            <defs>
              <radialGradient id="bg-ocean" cx="50%" cy="36%" r="64%">
                <stop offset="0" stopColor="#2c3183" />
                <stop offset=".68" stopColor="#1c2054" />
                <stop offset="1" stopColor="#14173a" />
              </radialGradient>
              <radialGradient id="bg-shade" cx="50%" cy="42%" r="56%">
                <stop offset=".66" stopColor="#0b0c22" stopOpacity="0" />
                <stop offset="1" stopColor="#0b0c22" stopOpacity=".6" />
              </radialGradient>
              <radialGradient id="bg-shine" cx="38%" cy="24%" r="40%">
                <stop offset="0" stopColor="#f7cf6b" stopOpacity=".16" />
                <stop offset="1" stopColor="#f7cf6b" stopOpacity="0" />
              </radialGradient>
              <filter id="bg-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22" /></filter>
              <clipPath id="bg-clip"><circle cx="500" cy="500" r="490" /></clipPath>
            </defs>
            <circle cx="500" cy="500" r="496" fill="#f7cf6b" opacity=".16" filter="url(#bg-glow)" />
            <circle cx="500" cy="500" r="490" fill="url(#bg-ocean)" />
            <g clipPath="url(#bg-clip)">
              <g ref={layer}>
                <path d={art.grid} fill="none" stroke="#f7eedc" strokeOpacity=".09" strokeWidth=".8" />
                <path d={art.land} fill="#3b1d52" fillOpacity=".78" stroke="#f7eedc" strokeOpacity=".22" strokeWidth="1" />
                <path d={art.isle} fill="#3b1d52" fillOpacity=".6" stroke="#f7eedc" strokeOpacity=".18" strokeWidth="1" />
                <path d={art.isle2} fill="#3b1d52" fillOpacity=".6" stroke="#f7eedc" strokeOpacity=".18" strokeWidth="1" />
                <path d={art.streets} fill="none" stroke="#f7eedc" strokeOpacity=".16" strokeWidth="1.2" strokeLinecap="round" />
                <path d={art.river} fill="none" stroke="#f2704d" strokeOpacity=".55" strokeWidth="14" strokeLinecap="round" />
              </g>
            </g>
            <circle cx="500" cy="500" r="490" fill="url(#bg-shine)" />
            <circle cx="500" cy="500" r="490" fill="url(#bg-shade)" />
            <circle cx="500" cy="500" r="490" fill="none" stroke="#f7cf6b" strokeOpacity=".35" strokeWidth="1.6" />
          </svg>
          <div className="bg-pins-clip">
            <div className="bg-pins" ref={pinsRef}>
              {branches.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  className={i === active ? "bg-pin is-active" : "bg-pin"}
                  style={{ left: `${points[i].x / 10}%`, top: `${points[i].y / 10}%`, "--delay": `${-i * 0.7}s` } as React.CSSProperties}
                  aria-label={`${b.name}, ${b.area}`}
                  onPointerEnter={onPinMove(i)}
                  onPointerMove={onPinMove(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setActive(i)}
                  onClick={() => goTo(i)}
                >
                  <i className="bg-pin__ring" />
                  <i className="bg-pin__sweep" />
                  <i className="bg-pin__core" />
                  <b className="bg-pin__label">{b.name}</b>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-track-wrap">
          <div className="bg-track" ref={track}>
            {branches.map((b, i) => (
              <a
                key={b.id}
                className={`bg-card${i === active ? " is-current" : ""}${i === cardHover ? " is-active" : ""}`}
                href={directionsUrl(b)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Directions to ${b.name}, ${b.address}`}
                onPointerEnter={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const ph = e.currentTarget.querySelector<HTMLElement>(".bg-card__photo")!;
                  ph.style.setProperty("--x", `${e.clientX - r.left}px`);
                  ph.style.setProperty("--y", `${e.clientY - r.top}px`);
                  setCardHover(i);
                  setActive(i);
                }}
                onPointerLeave={() => setCardHover(null)}
              >
                <span className="bg-card__photo" style={{ "--photo": `url("${b.img}")` } as React.CSSProperties} />
                <span className="bg-card__top">
                  <span className="bg-card__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="bg-card__label">{b.area}</span>
                </span>
                <span className="bg-card__bottom">
                  <span>
                    <span className="bg-card__city">{b.name}</span>
                    <span className="bg-card__areas">{b.address}</span>
                  </span>
                  <span className="bg-card__icon">
                    <span className="bg-card__pin">
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="8" cy="5.5" r="3" /><path d="M8 8.5V15" /></svg>
                    </span>
                    <span className="bg-card__arrow">
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" /></svg>
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-progress" aria-hidden="true">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <i><b style={{ width: `${((active + 1) / branches.length) * 100}%` }} /></i>
          <span>{String(branches.length).padStart(2, "0")}</span>
        </div>

        {hovered && hover && (
          <div className={hover.flip ? "pin-card flip" : "pin-card"} style={{ left: hover.x, top: hover.y }} aria-hidden="true">
            <img src={hovered.img} alt="" />
            <span><b>{hovered.name}</b><small>{hovered.area} · {hovered.hours}</small></span>
          </div>
        )}
      </div>
    </section>
  );
}
