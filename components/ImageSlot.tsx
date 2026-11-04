"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReduced } from "@/lib/motion";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Curtain reveal as the image scrolls into view */
  wipe?: boolean;
  /** Parallax strength, e.g. 0.08 or -0.08 */
  speed?: number;
  priority?: boolean;
  id?: string;
  children?: React.ReactNode;
};

const MIN_SHIMMER = 450; // keeps the transition smooth on fast connections

/** A figure that shows a shimmer and spinner until its image is ready, then fades it in. */
export default function ImageSlot({ src, alt, width, height, className = "", wipe, speed, priority, id, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"is-loading" | "is-loaded" | "is-failed">("is-loading");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    setState("is-loading");
    const t0 = performance.now();
    const min = prefersReduced() ? 0 : MIN_SHIMMER;
    let timer = 0;
    const finish = (s: "is-loaded" | "is-failed") => {
      timer = window.setTimeout(() => setState(s), Math.max(0, min - (performance.now() - t0)));
    };
    const ok = () => finish("is-loaded");
    const bad = () => finish("is-failed");
    if (img.complete && img.naturalWidth) ok();
    else if (img.complete) bad();
    else {
      img.addEventListener("load", ok, { once: true });
      img.addEventListener("error", bad, { once: true });
    }
    return () => { clearTimeout(timer); img.removeEventListener("load", ok); img.removeEventListener("error", bad); };
  }, [src]);

  useEffect(() => {
    if (!wipe || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [wipe]);

  const classes = ["img-slot", state, wipe && "img-wipe", wipe && inView && "is-in", speed !== undefined && "parallax", className]
    .filter(Boolean).join(" ");

  return (
    <figure ref={ref} id={id} className={classes} data-speed={speed}>
      {/* Plain <img> so placeholder SVGs and your own JPG/PNG/WebP files all work without extra config */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {children}
    </figure>
  );
}
