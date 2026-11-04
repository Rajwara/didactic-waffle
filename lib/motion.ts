export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export const setTheme = (t?: string | null) => {
  if (!t) return;
  const root = document.documentElement;
  if (root.dataset.theme !== t) root.dataset.theme = t;
};

/** Fired once the intro loader has finished (or was skipped). */
export const READY_EVENT = "dw:ready";
type W = Window & { __dwReady?: boolean };
export const isReady = () => typeof window !== "undefined" && (window as W).__dwReady === true;
export const markReady = () => {
  (window as W).__dwReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
};
export const onReady = (fn: () => void) => {
  if (isReady()) { fn(); return () => {}; }
  window.addEventListener(READY_EVENT, fn, { once: true });
  return () => window.removeEventListener(READY_EVENT, fn);
};

export const store = {
  get(area: "localStorage" | "sessionStorage", key: string) {
    try { return window[area].getItem(key); } catch { return null; }
  },
  set(area: "localStorage" | "sessionStorage", key: string, value: string) {
    try { window[area].setItem(key, value); } catch { /* storage unavailable */ }
  },
};
