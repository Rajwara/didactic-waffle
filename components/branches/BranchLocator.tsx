"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import BranchMap from "./BranchMap";
import { branches, directionsUrl } from "@/lib/site";

type Origin = { lat: number; lng: number };

const km = (a: Origin, b: Origin) => {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const numbered = branches.map((b, i) => ({ ...b, n: i + 1 }));

/** Shop finder: search by name or area, or use your location to sort by distance. */
export default function BranchLocator() {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [status, setStatus] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);

  const list = useMemo(() => {
    const q = norm(query);
    let l = numbered.map((b) => ({ ...b, dist: origin ? km(origin, b) : undefined }));
    if (q) l = l.filter((b) => norm(`${b.name} ${b.area} ${b.address}`).includes(q));
    if (origin) l.sort((a, b) => a.dist! - b.dist!);
    return l;
  }, [query, origin]);

  const locate = () => {
    if (!navigator.geolocation) return setStatus("Your browser can't share its location.");
    setStatus("Finding you…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setOrigin({ lat: p.coords.latitude, lng: p.coords.longitude }); setQuery(""); setStatus("Nearest shops to you"); },
      () => setStatus("Location was declined. Type an area instead."),
      { timeout: 10000 },
    );
  };
  const reset = () => { setOrigin(null); setQuery(""); setStatus(""); setActive(null); };
  const hovered = hover ? numbered.find((b) => b.id === hover.id) : null;
  const fmt = (d: number) => (d < 10 ? d.toFixed(1) : String(Math.round(d)));

  return (
    <section className="bl-loc" id="find" data-theme-section="day">
      <div className="bl-loc__panel">
        <p className="eyebrow reveal">Shop finder</p>
        <h2 className="bl-loc__title reveal">Find your <em>nearest shop</em></h2>
        <form className="bl-loc__search reveal" role="search" onSubmit={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
          <input value={query} onChange={(e) => { setQuery(e.target.value); setStatus(""); }} placeholder="Search a shop or area" aria-label="Search for a shop or area" />
        </form>
        <div className="bl-loc__tools reveal">
          <button type="button" onClick={locate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
            Use my location
          </button>
          {(origin || query) && <button type="button" onClick={reset}>Show all {numbered.length} shops</button>}
        </div>
        <p className="bl-loc__status" aria-live="polite">
          {status || (query ? `${list.length} ${list.length === 1 ? "shop" : "shops"} matching “${query}”` : `${numbered.length} shops, all baked by the same night shift`)}
        </p>
        <ol className="bl-loc__list">
          {list.map((b, i) => (
            <li key={b.id} className={active === b.id ? "is-on" : undefined} onMouseEnter={() => setActive(b.id)}>
              <button type="button" className="bl-loc__item" onClick={() => setActive(b.id)}>
                <span className="bl-loc__n">{b.n}</span>
                <span>
                  <b>{b.name}</b>
                  <small>{b.address}</small>
                  <small className="bl-loc__hours">{b.hours}</small>
                </span>
                {b.dist !== undefined && b.dist < 500 && (
                  <span className={`bl-loc__dist${i === 0 ? " is-near" : ""}`}>{i === 0 && <em>Nearest</em>}{fmt(b.dist)} km</span>
                )}
              </button>
              <div className="bl-loc__actions">
                <a className="btn" href={directionsUrl(b, origin ?? undefined)} target="_blank" rel="noopener noreferrer">Get directions</a>
                <a className="bl-loc__call" href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}>Call</a>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="bl-loc__none">No shop matches that. Try another area, or use your location.</li>}
        </ol>
      </div>
      <div className="bl-loc__map" onPointerLeave={() => setHover(null)}>
        <BranchMap
          branches={numbered}
          active={active ?? hover?.id}
          origin={origin}
          label="Map of our shops"
          onPin={(id, at) => { if (id && at) { setHover({ id, x: at.x, y: at.y }); setActive(id); } }}
        />
        {hovered && hover && (
          <div className={`bl-loc__card${hover.x > 60 ? " is-flip" : ""}`} style={{ left: `${hover.x}%`, top: `${hover.y}%` }} aria-hidden="true">
            <img src={hovered.img} alt="" />
            <span><b>{hovered.name}</b><small>{hovered.area}</small></span>
          </div>
        )}
      </div>
    </section>
  );
}
