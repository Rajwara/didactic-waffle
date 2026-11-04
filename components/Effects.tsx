"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { canHover, clamp, onReady, prefersReduced, setTheme } from "@/lib/motion";

const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)] as T[];

/**
 * One place for all the page-wide motion: theme changes, scroll reveals,
 * counters, parallax, scroll progress, magnetic buttons, the custom cursor
 * and the yellow wipe between pages. Re-runs whenever the route changes.
 */
export default function Effects() {
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [wipeKey, setWipeKey] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  /* ---------- Page transitions ---------- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || prefersReduced() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute("download")) return;
      if (a.getAttribute("aria-disabled") === "true") { e.preventDefault(); return; }
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const samePage = url.pathname === location.pathname && url.search === location.search;
      if (samePage) return;
      e.preventDefault();
      setLeaving(true);
      setTimeout(() => router.push(url.pathname + url.search + url.hash), 480);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setLeaving(false);
    setWipeKey((k) => k + 1);
  }, [pathname]);

  /* ---------- Per-page effects ---------- */
  useEffect(() => {
    const reduced = prefersReduced();
    const main = document.getElementById("main");
    const cleanups: (() => void)[] = [];

    // Theme starts from the first section of the page, then follows whatever is mid-screen
    setTheme(main?.querySelector<HTMLElement>("[data-theme-section]")?.dataset.themeSection);
    const themeIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setTheme((e.target as HTMLElement).dataset.themeSection); });
    }, { rootMargin: "-50% 0px -50% 0px" });
    $$("[data-theme-section]").forEach((s) => themeIO.observe(s));
    cleanups.push(() => themeIO.disconnect());

    // Everything else waits for the intro loader to lift
    let revealIO: IntersectionObserver | null = null;
    let countIO: IntersectionObserver | null = null;
    const start = () => {
      $$(".hero .line, .page-head .line").forEach((l) => l.classList.add("is-in"));

      revealIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          $$(".line", e.target).forEach((l) => l.classList.add("is-in"));
          revealIO?.unobserve(e.target);
        });
      }, { threshold: 0.12 });
      $$("[data-reveal], .reveal:not(.card), .display").forEach((el) => revealIO!.observe(el));

      countIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          countIO?.unobserve(e.target);
          const el = e.target as HTMLElement;
          const target = Number(el.dataset.count);
          if (reduced) { el.textContent = String(target); return; }
          const t0 = performance.now();
          const run = (t: number) => {
            const p = clamp((t - t0) / 1400, 0, 1);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(run);
          };
          requestAnimationFrame(run);
        });
      }, { threshold: 0.6 });
      $$("[data-count]").forEach((c) => countIO!.observe(c));
    };
    cleanups.push(onReady(start));
    cleanups.push(() => { revealIO?.disconnect(); countIO?.disconnect(); });

    // Scroll loop: hero loaf drift, parallax, progress bar, ticker skew
    const loaf = document.getElementById("heroLoaf");
    const parallax = $$(".parallax");
    const tickers = $$(".ticker__track");
    let ticking = false, lastY = scrollY, skew = 0, raf = 0;
    const onScroll = () => {
      const y = scrollY;
      if (loaf && !reduced && y < innerHeight * 1.2) loaf.style.transform = `translateY(${y * -0.28}px) rotate(${y * 0.06}deg)`;
      if (!reduced) parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        el.querySelector("img")?.style.setProperty("--py", `${(r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset.speed || 0)}px`);
      });
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${clamp(y / Math.max(1, document.documentElement.scrollHeight - innerHeight), 0, 1)})`;
      if (!reduced) skew = clamp(skew + (y - lastY) * 0.06, -8, 8);
      lastY = y;
      ticking = false;
    };
    const settle = () => {
      skew *= 0.9;
      tickers.forEach((t) => t.parentElement!.style.setProperty("--skew", `${skew.toFixed(2)}deg`));
      raf = requestAnimationFrame(settle);
    };
    if (tickers.length && !reduced) raf = requestAnimationFrame(settle);
    const scrollHandler = () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } };
    addEventListener("scroll", scrollHandler, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
    cleanups.push(() => { removeEventListener("scroll", scrollHandler); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); });

    // Hover: magnetic buttons
    if (!reduced && canHover()) {
      $$(".magnetic").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        };
        const leave = () => { el.style.transform = ""; };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
      });
    }

    return () => cleanups.forEach((c) => c());
  }, [pathname]);

  /* ---------- Custom cursor (mouse only) ---------- */
  useEffect(() => {
    const dot = cursorRef.current;
    if (!dot || prefersReduced() || !canHover()) return;
    document.documentElement.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      dot.classList.add("is-on");
      const t = e.target as Element;
      const card = t.closest?.(".card__tile, .img-slot");
      const hot = t.closest?.("a, button, summary, input, textarea, label");
      dot.classList.toggle("is-view", !!card && !hot?.matches("button"));
      dot.classList.toggle("is-hot", !!hot && !card);
    };
    const out = () => dot.classList.remove("is-on");
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      dot.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener("pointermove", move);
    document.addEventListener("pointerleave", out);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", out);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div key={wipeKey} className={`page-wipe${leaving ? " is-leaving" : ""}`} aria-hidden="true" />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <div className="cursor" ref={cursorRef} aria-hidden="true"><span>View</span></div>
    </>
  );
}
