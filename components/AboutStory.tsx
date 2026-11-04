"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { images, site } from "@/lib/site";
import { onReady } from "@/lib/motion";

/* ---------- Content: edit the About page here ---------- */

// Hero slider: each slide is small / large / small
const SLIDES: [string, string, string][] = [
  [images.productBaguette, images.hero, images.productButterCrescent],
  [images.productCookie, images.productCountryLoaf, images.productLemonTart],
  [images.productCardamomSwirl, images.productSeededRye, images.productMorningCake],
];

const ABOUT_LINES = [
  "Every night since our first starter,",
  "we have baked while the street sleeps:",
  "slow ferments, cold butter, hot stone,",
  "and a rule that nothing leaves the bench",
  "until we would eat it ourselves",
];

const SERVICES = [
  { id: "svc2", side: "left",  title: "Bread",              href: "/menu",    img: images.productCountryLoaf,    alt: "Country sourdough loaf on linen" },
  { id: "svc4", side: "left",  title: "Preorder boxes",     href: "/contact", img: images.shiftDoors,            alt: "Shelves of fresh bread in morning light" },
  { id: "svc1", side: "right", title: "Pastry",             href: "/menu",    img: images.productButterCrescent, alt: "Golden butter crescent" },
  { id: "svc3", side: "right", title: "Sweet things",       href: "/menu",    img: images.productLemonTart,      alt: "Lemon tart with toasted meringue" },
] as const;

const STEPS = [
  { title: "The mix",   time: "03:00", img: images.shiftMix,  text: "Flour, water, salt and a starter older than the shop. The dough has been resting since yesterday afternoon." },
  { title: "The fold",  time: "04:30", img: images.shiftFold, text: "Every loaf is shaped by hand and every croissant is rolled while the butter is still cold." },
  { title: "The oven",  time: "05:45", img: images.shiftOven, text: "Stone deck, plenty of steam, and a crust taken darker than you'd expect. That is where the flavor lives." },
  { title: "The doors", time: "07:00", img: images.shiftDoors, text: "The shelves are full, the coffee is on, and the first regulars are already outside." },
];

const STORY = [
  { pill: "Our beginning", title: "One starter, one oven", tag: "Day one", img: images.aboutBakery,     href: "/about",   alt: "Bakery kitchen before dawn" },
  { pill: "The night shift", title: "Baking while you sleep", tag: "03:00", img: images.shiftOven,     href: "/#night-shift", alt: "Loaves coming out of the oven" },
  { pill: "The shop",    title: "Doors open at seven",     tag: "07:00", img: images.visitShopfront,  href: "/contact", alt: "Bakery shopfront at sunrise" },
  { pill: "Today",       title: "Sold out by two",         tag: "14:00", img: images.shiftLastLoaf,   href: "/menu",    alt: "The last loaf on the shelf" },
];

const VALUES = [
  { label: "Time over additives", img: images.productCountryLoaf,    quote: "A long, cold ferment builds flavor and structure, so our recipes can stay short and honest." },
  { label: "A short menu",        img: images.productButterCrescent, quote: "Eight bakes we can make well every day, rather than thirty we can only make quickly." },
  { label: "Sell out, then stop", img: images.productBaguette,       quote: "We bake a set amount and close when it's gone. It keeps waste low and the bread fresh." },
  { label: "Real butter",         img: images.productCardamomSwirl,  quote: "Cold butter, rolled by hand over two days. There is no shortcut that tastes the same." },
  { label: "Dark crusts",         img: images.productSeededRye,      quote: "We take every crust darker than you'd expect, because that is where the flavor lives." },
  { label: "Neighbors first",     img: images.productCookie,         quote: "Reserve a box the night before and it waits for you, however long the morning queue gets." },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);

function Btn({ href, children }: { href: string; children: string }) {
  return (
    <Link className="ab-btn magnetic" href={href}>
      <span className="ab-roll"><span data-t={children}>{children}</span></span>
      <span className="ab-ico"><Arrow /></span>
    </Link>
  );
}

const css = (v: Record<string, string>) => v as React.CSSProperties;

export default function AboutStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current!;
    const $ = (s: string) => scope.querySelector<HTMLElement>(s)!;
    const $$ = (s: string) => Array.from(scope.querySelectorAll<HTMLElement>(s));
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const desktop = window.matchMedia("(min-width: 992px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const off: (() => void)[] = [];
    const on = (t: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
      t.addEventListener(type, fn, opts);
      off.push(() => t.removeEventListener(type, fn, opts));
    };

    /* Fit the fixed 1200px desktop composition on narrower laptops */
    const page = $(".ab");
    const fit = () => {
      const w = document.documentElement.clientWidth;
      page.style.zoom = w >= 992 && w < 1334 ? String(w / 1334) : "";
    };
    fit();
    on(window, "resize", fit);

    /* Reveal groups: animate once when the group scrolls into view (after the loader) */
    let io: IntersectionObserver | null = null;
    off.push(onReady(() => {
      const groups = $$("[data-group]");
      if (reduced) { groups.forEach((g) => g.classList.add("in")); return; }
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io!.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -10% 0px" });
      groups.forEach((g) => io!.observe(g));
    }));

    /* Hero slider: hold, slide, loop forever. Clones at both ends make the loop seamless. */
    const n = SLIDES.length;
    const trackEl = $(".ab-track");
    let i = 1;
    let timer: ReturnType<typeof setInterval> | undefined;
    const set = (v: number) => { i = v; trackEl.style.setProperty("--i", String(i)); };
    const go = (v: number) => { trackEl.classList.remove("snap"); set(v); };
    const snap = (v: number) => { trackEl.classList.add("snap"); set(v); void trackEl.offsetWidth; trackEl.classList.remove("snap"); };
    on(trackEl, "transitionend", (e) => {
      if (e.target !== trackEl) return;
      if (i > n) snap(i - n); else if (i < 1) snap(i + n);
    });
    const stop = () => clearInterval(timer);
    const play = () => { stop(); if (!reduced) timer = setInterval(() => go(i + 1), 2600); };
    set(1);
    on($(".ab-hit.next"), "click", () => { if (i > n) snap(i - n); go(i + 1); play(); });
    on($(".ab-hit.prev"), "click", () => { if (i < 1) snap(i + n); go(i - 1); play(); });
    let x0: number | null = null;
    const slider = $(".ab-slider");
    on(slider, "touchstart", ((e: TouchEvent) => { x0 = e.touches[0].clientX; stop(); }) as EventListener, { passive: true });
    on(slider, "touchend", ((e: TouchEvent) => {
      if (x0 !== null) { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); }
      x0 = null; play();
    }) as EventListener);
    on(slider, "mouseenter", stop);
    on(slider, "mouseleave", play);
    on(document, "visibilitychange", () => (document.hidden ? stop() : play()));
    play();

    /* Scroll-linked keyframes with heavy smoothing.
       progress is 0 when a section's top enters the viewport and 100 when its bottom leaves. */
    type Props = Partial<Record<"w" | "x" | "y" | "s" | "o", number>>;
    type Frame = [number, Props];
    type Track = { el: HTMLElement; frames: Frame[] };
    type Scene = { sec: HTMLElement; smooth: number; always: boolean; tracks: Track[]; cur?: number; drawn?: number };
    const tr = (el: HTMLElement, frames: Frame[]): Track => ({ el, frames });
    const inks = $$(".ab-ink");
    const scenes: Scene[] = [
      {
        sec: $("#ab-about"), smooth: 0.96, always: true,
        tracks: [
          tr(inks[0], [[16, { w: 0 }], [24, { w: 105 }]]),
          tr(inks[1], [[25, { w: 0 }], [37, { w: 105 }]]),
          tr(inks[2], [[38, { w: 0 }], [43, { w: 105 }]]),
          tr(inks[3], [[44, { w: 0 }], [49, { w: 105 }]]),
          tr(inks[4], [[54, { w: 0 }], [65, { w: 105 }]]),
        ],
      },
      {
        sec: $("#ab-services"), smooth: 0.97, always: false,
        tracks: [
          tr($("#svcHead"), [[0, { o: 0, x: -469 }], [25, { o: 1, x: 0 }]]),
          tr($("#svc1"), [[7, { s: 0 }], [30, { s: 1 }]]),
          tr($("#svc2"), [[30, { s: 0, x: 354, y: -119 }], [42, { s: 1, x: 0, y: 0 }]]),
          tr($("#svc3"), [[42, { s: 0, x: -406, y: -273 }], [50, { s: 1, x: 0, y: 0 }]]),
          tr($("#svc4"), [[54, { s: 0, x: 391, y: -108 }], [73, { s: 1, x: 0, y: 0 }]]),
          tr($("#svcText"), [[56, { o: 0, x: 378 }], [73, { o: 1, x: 100 }]]),
        ],
      },
    ];
    const valueAt = (frames: Frame[], prop: keyof Props, p: number) => {
      const pts = frames.filter((f) => prop in f[1]);
      if (!pts.length) return undefined;
      if (p <= pts[0][0]) return pts[0][1][prop]!;
      for (let k = 1; k < pts.length; k++) {
        if (p <= pts[k][0]) {
          const t = (p - pts[k - 1][0]) / (pts[k][0] - pts[k - 1][0]);
          return pts[k - 1][1][prop]! + (pts[k][1][prop]! - pts[k - 1][1][prop]!) * t;
        }
      }
      return pts[pts.length - 1][1][prop]!;
    };
    const apply = (t: Track, p: number) => {
      const w = valueAt(t.frames, "w", p);
      if (w !== undefined) { t.el.style.width = w + "%"; return; }
      const x = valueAt(t.frames, "x", p) || 0, y = valueAt(t.frames, "y", p) || 0;
      const s = valueAt(t.frames, "s", p), o = valueAt(t.frames, "o", p);
      t.el.style.transform = `translate(${x}px,${y}px) scale(${s === undefined ? 1 : s})`;
      if (o !== undefined) t.el.style.opacity = String(o);
    };
    const clearScene = (sc: Scene) => {
      sc.tracks.forEach((t) => { t.el.style.transform = ""; t.el.style.opacity = ""; });
      sc.cur = sc.drawn = undefined;
    };
    const target = (sc: Scene) => {
      const r = sc.sec.getBoundingClientRect(), vh = innerHeight;
      return clamp((vh - r.top) / (r.height + vh), 0, 1) * 100;
    };
    let last = 0, raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) || 16.67;
      last = now;
      scenes.forEach((sc) => {
        if (!sc.always && !desktop.matches) { if (sc.cur !== undefined) clearScene(sc); return; }
        const goal = target(sc);
        if (sc.cur === undefined || reduced) sc.cur = goal;
        else sc.cur += (goal - sc.cur) * (1 - Math.pow(sc.smooth, dt / 16.67));
        if (sc.drawn === undefined || Math.abs(sc.drawn - sc.cur) > 0.005) {
          sc.tracks.forEach((t) => apply(t, sc.cur!));
          sc.drawn = sc.cur;
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* Process: hover unblurs a row and shows its tilted photo; click opens its details */
    const pImgs = $$(".ab-process-images > div");
    const cards = $$(".ab-process-card");
    const openStep = (card: HTMLElement | null) => {
      cards.forEach((c, k) => {
        const open = c === card;
        c.classList.toggle("open", open);
        c.setAttribute("aria-expanded", String(open));
        pImgs[k].classList.toggle("on", open);
      });
    };
    cards.forEach((c, k) => {
      on(c, "mouseenter", () => pImgs[k].classList.add("on"));
      on(c, "mouseleave", () => { if (!c.classList.contains("open")) pImgs[k].classList.remove("on"); });
      on(c, "click", () => openStep(c.classList.contains("open") ? null : c));
      on(c, "keydown", ((e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openStep(c.classList.contains("open") ? null : c); }
      }) as EventListener);
    });

    /* Values tabs */
    const tabs = $$(".ab-tab"), panes = $$(".ab-pane");
    const select = (idx: number) => {
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === idx)); t.tabIndex = k === idx ? 0 : -1; });
      panes.forEach((p, k) => {
        p.classList.toggle("show", k === idx);
        p.classList.remove("fade");
        if (k === idx) { void p.offsetWidth; p.classList.add("fade"); }
      });
    };
    tabs.forEach((t, k) => {
      on(t, "click", () => select(k));
      on(t, "keydown", ((e: KeyboardEvent) => {
        const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (d) { e.preventDefault(); const m = (k + d + tabs.length) % tabs.length; select(m); tabs[m].focus(); }
      }) as EventListener);
    });
    select(0);

    return () => { off.forEach((f) => f()); clearInterval(timer); cancelAnimationFrame(raf); io?.disconnect(); };
  }, []);

  // Slider order with clones: last, 1, 2, 3, first, second
  const loop = [SLIDES[SLIDES.length - 1], ...SLIDES, SLIDES[0], SLIDES[1]];
  const word = site.second.toUpperCase().split("");

  return (
    <div ref={root} className="ab-root">
      <div className="ab">
        {/* HERO */}
        <section className="ab-gutter ab-hero" data-theme-section="night">
          <div className="ab-wrap" data-group="">
            <div className="ab-hero-top">
              <h1 className="ab-h1 ab-hero-title" data-r="" style={css({ "--x": "-80px", "--d": "1.4s" })}>
                The art of the <em>overnight</em> loaf.
              </h1>
              <div className="ab-hero-intro" data-r="" style={css({ "--x": "80px", "--d": "1.4s", "--w": ".3s" })}>
                <p>{site.name} is a neighborhood night bakery. We start when the street goes quiet, and by morning the shelves are full of slow-fermented bread and pastry.</p>
                <Btn href="/menu">See today&apos;s menu</Btn>
              </div>
            </div>
            <div className="ab-hero-bottom">
              <div className="ab-hero-side" data-r="" style={css({ "--d": "1.4s" })}>
                <span className="ab-side-clock">03:00</span>
                <span className="ab-side-line" />
                <span className="ab-side-clock">07:00</span>
              </div>
              <div className="ab-hero-stage">
                <div className="ab-slider-wrap">
                  <div className="ab-slider" aria-roledescription="carousel" aria-label="Fresh from the oven">
                    <div className="ab-track">
                      {loop.map((s, k) => (
                        <div className="ab-slide" key={k} aria-hidden={k === 0 || k > SLIDES.length}>
                          <figure><img src={s[0]} alt="" loading={k < 3 ? "eager" : "lazy"} /></figure>
                          <figure className="big"><img src={s[1]} alt="" loading={k < 3 ? "eager" : "lazy"} /></figure>
                          <figure><img src={s[2]} alt="" loading={k < 3 ? "eager" : "lazy"} /></figure>
                        </div>
                      ))}
                    </div>
                    <button className="ab-hit prev" type="button" aria-label="Previous slide" />
                    <button className="ab-hit next" type="button" aria-label="Next slide" />
                  </div>
                  <div className="ab-wordmark" aria-hidden="true">
                    {word.map((c, k) => <span key={k} style={css({ "--i": String(k) })}>{c}</span>)}
                  </div>
                </div>
                <div className="ab-scroll-cue" data-r="" style={css({ "--d": "1.4s" })}>
                  <svg viewBox="0 0 16 42" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M8 0v41M1 34l7 7 7-7" /></svg>
                  <span>Scroll down</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT: lines fill in as you scroll */}
        <section className="ab-gutter" id="ab-about" data-theme-section="plum">
          <div className="ab-wrap ab-pad" data-group="">
            <h2 className="ab-label ab-center" data-r="">About us</h2>
            <p className="ab-lines" data-r="" aria-label={ABOUT_LINES.join(" ")}>
              {ABOUT_LINES.map((l) => (
                <span className="ab-line" key={l} aria-hidden="true">{l}<span className="ab-ink">{l}</span></span>
              ))}
            </p>
            <div className="ab-about-bottom" data-r="">
              <div className="ab-about-img"><img src={images.shiftMix} alt="Hands lifting wet dough from a bowl" loading="lazy" /></div>
              <Btn href="/menu">Taste the result</Btn>
              <div className="ab-about-img"><img src={images.aboutFlour} alt="Flour falling from an open hand" loading="lazy" /></div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="ab-gutter" id="ab-services" data-theme-section="morning">
          <div className="ab-wrap ab-pad">
            <div className="ab-services">
              <div className="ab-svc-left">
                <h2 className="ab-h2" id="svcHead">What we bake <em>for you</em></h2>
                {SERVICES.filter((s) => s.side === "left").map((s) => (
                  <Link className="ab-svc-card" id={s.id} key={s.id} href={s.href}>
                    <div className="ab-svc-img"><img src={s.img} alt={s.alt} loading="lazy" /></div>
                    <div className="ab-h6">{s.title} <span aria-hidden="true">→</span></div>
                  </Link>
                ))}
              </div>
              <div className="ab-svc-right">
                {SERVICES.filter((s) => s.side === "right").map((s) => (
                  <Link className="ab-svc-card" id={s.id} key={s.id} href={s.href}>
                    <div className="ab-svc-img"><img src={s.img} alt={s.alt} loading="lazy" /></div>
                    <div className="ab-h6">{s.title} <span aria-hidden="true">→</span></div>
                  </Link>
                ))}
                <div className="ab-svc-text" id="svcText">
                  <p>From a daily country loaf to a whole morning cake, everything is baked in set amounts overnight. Reserve a box and we&apos;ll set it aside for you.</p>
                  <Btn href="/contact">Reserve a box</Btn>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="ab-gutter" id="ab-process" data-theme-section="day">
          <div className="ab-wrap ab-pad" data-group="">
            <h2 className="ab-h2 ab-center ab-process-head" data-r="">How a loaf <em>is made</em></h2>
            <div className="ab-process-list" data-r="">
              {STEPS.map((s, k) => (
                <div className="ab-process-card" key={s.title} role="button" tabIndex={0} aria-expanded="false" aria-controls={`ab-step-${k}`}>
                  <span className="ab-num">0{k + 1}</span>
                  <span className="ab-dot" />
                  <h3 className="ab-h3">{s.title} <span className="ab-time">{s.time}</span></h3>
                  <p className="ab-desc" id={`ab-step-${k}`}>{s.text}</p>
                </div>
              ))}
              <div className="ab-process-images" aria-hidden="true">
                {STEPS.map((s) => <div key={s.title}><img src={s.img} alt="" loading="lazy" /></div>)}
              </div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="ab-gutter" id="ab-story" data-theme-section="dawn">
          <div className="ab-wrap ab-pad" data-group="">
            <div className="ab-story-head" data-r="">
              <h2 className="ab-h2">Our story, <em>night by night</em></h2>
              <Btn href="/#night-shift">The night shift</Btn>
            </div>
            <div className="ab-story-grid">
              {STORY.map((s) => (
                <Link className="ab-story-card" data-r="" key={s.title} href={s.href}>
                  <img src={s.img} alt={s.alt} loading="lazy" />
                  <div className="ab-story-info">
                    <div><span className="ab-pill">{s.pill}</span><div className="ab-h6">{s.title}</div></div>
                    <span className="ab-tag">{s.tag}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="ab-gutter" id="ab-values" data-theme-section="night">
          <div className="ab-wrap ab-pad" data-group="">
            <h2 className="ab-h2 ab-center ab-values-head" data-r="">What we <em>stand for</em></h2>
            <div className="ab-tabs" role="tablist" aria-label="What we stand for">
              {VALUES.map((v, k) => (
                <button className="ab-tab" key={v.label} type="button" role="tab" aria-selected={k === 0} aria-label={v.label}>
                  <img src={v.img} alt="" loading="lazy" />
                </button>
              ))}
              <div className="ab-panes" data-r="">
                {VALUES.map((v, k) => (
                  <div className={`ab-pane${k === 0 ? " show fade" : ""}`} role="tabpanel" key={v.label}>
                    <svg className="ab-quote" viewBox="0 0 50 42" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 41V19C1 9 6 3 18 1v5c-5 2-7 5-7 9h10v26H1zM29 41V19c0-10 5-16 17-18v5c-5 2-7 5-7 9h10v26H29z" /></svg>
                    <p className="ab-h4">{v.quote}</p>
                    <p className="ab-h6 ab-tname">{v.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
