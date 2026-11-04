"use client";

import { useMemo } from "react";
import type { Branch } from "@/lib/site";

type Pt = { x: number; y: number };

/** Places branches on a 0–100 grid from their coordinates, with padding. */
export function project(branches: Branch[], extra?: { lat: number; lng: number } | null) {
  const pts = extra ? [...branches, extra] : branches;
  const lats = pts.map((b) => b.lat), lngs = pts.map((b) => b.lng);
  const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const spanLat = Math.max(maxLat - minLat, 0.01), spanLng = Math.max(maxLng - minLng, 0.01);
  return (p: { lat: number; lng: number }): Pt => ({
    x: 14 + ((p.lng - minLng) / spanLng) * 72,
    y: 14 + ((maxLat - p.lat) / spanLat) * 72,
  });
}

/** Stylized night map: no tiles or API key, just streets, a river and glowing pins. */
export default function BranchMap({
  branches, active, onPin, origin, label,
}: {
  branches: (Branch & { n: number })[];
  active?: string | null;
  onPin?: (id: string | null, at?: Pt) => void;
  origin?: { lat: number; lng: number } | null;
  label: string;
}) {
  // Only use the visitor's position for the frame if it's close by
  const near = origin && branches.some((b) => Math.abs(b.lat - origin.lat) < 0.2 && Math.abs(b.lng - origin.lng) < 0.2) ? origin : null;
  const toXY = useMemo(() => project(branches, near), [branches, near]);

  return (
    <div className="bm" role="img" aria-label={label}>
      <svg className="bm__streets" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="bm-grid" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <path d="M8 0H0V8" fill="none" stroke="currentColor" strokeWidth=".18" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#bm-grid)" className="bm__grid" />
        <path className="bm__road" d="M-5 30 C 20 26, 40 40, 60 34 S 90 20, 105 26" />
        <path className="bm__road" d="M-5 70 C 25 66, 45 74, 70 64 S 95 58, 105 62" />
        <path className="bm__road" d="M30 -5 C 34 25, 26 55, 36 105" />
        <path className="bm__road" d="M72 -5 C 66 30, 78 60, 70 105" />
        <path className="bm__river" d="M-5 88 C 15 80, 30 92, 50 84 S 80 70, 105 78" />
        <circle className="bm__park" cx="52" cy="52" r="7" />
      </svg>
      {near && (() => { const p = toXY(near); return <span className="bm__you" style={{ left: `${p.x}%`, top: `${p.y}%` }}><i />You</span>; })()}
      {branches.map((b) => {
        const p = toXY(b);
        return (
          <button
            key={b.id}
            type="button"
            className={`bm__pin${active === b.id ? " is-on" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            aria-label={`${b.name}, ${b.area}`}
            onPointerEnter={() => onPin?.(b.id, p)}
            onFocus={() => onPin?.(b.id, p)}
            onClick={() => onPin?.(b.id, p)}
          >
            <svg viewBox="0 0 32 42" aria-hidden="true"><path d="M16 41s13-14.2 13-24.5A13 13 0 0 0 3 16.5C3 26.8 16 41 16 41Z" /></svg>
            <b>{b.n}</b>
          </button>
        );
      })}
    </div>
  );
}
