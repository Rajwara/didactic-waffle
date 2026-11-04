"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { navLinks, site } from "@/lib/site";

export default function Nav() {
  const pathname = usePathname();
  const { count, bump, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);

  // Hide the bar on scroll down, bring it back on scroll up
  useEffect(() => {
    let lastY = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setHidden(y > lastY && y > 160);
      lastY = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menu]);

  // Bounce the counter every time something is added
  useEffect(() => {
    const el = countRef.current;
    if (!el || bump === 0) return;
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }, [bump]);

  return (
    <header className={`nav${hidden && !menu ? " is-hidden" : ""}${menu ? " menu-open" : ""}`}>
      <Link className="nav__logo" href="/">
        <span className="nav__logo-mark" aria-hidden="true" />
        {site.first}<em>{site.second}</em>
      </Link>
      <nav className={`nav__links${menu ? " is-open" : ""}`} id="navLinks" aria-label="Main">
        {navLinks.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            style={{ "--i": i } as React.CSSProperties}
            aria-current={pathname === l.href ? "page" : undefined}
            onClick={() => setMenu(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="nav__actions">
        <button className="box-btn" type="button" onClick={() => setOpen(true)}>
          Box <span className="box-btn__count" ref={countRef} aria-live="polite">{count}</span>
        </button>
        <button
          className="nav__toggle"
          type="button"
          aria-expanded={menu}
          aria-controls="navLinks"
          aria-label="Toggle menu"
          onClick={() => setMenu((m) => !m)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}
