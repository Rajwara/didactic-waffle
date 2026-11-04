"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { byId, money } from "@/lib/site";

export default function Drawer() {
  const { cart, count, total, open, setOpen, change } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      lastFocus.current = document.activeElement;
      closeRef.current?.focus();
    } else if (lastFocus.current instanceof HTMLElement) {
      lastFocus.current.focus();
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) setOpen(false); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const rows = Object.entries(cart).filter(([id]) => byId(id));

  return (
    <>
      <div className="scrim" hidden={!open} onClick={() => setOpen(false)} />
      <aside
        className={`drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawerTitle"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="drawer__head">
          <h2 id="drawerTitle">Your box</h2>
          <button type="button" ref={closeRef} aria-label="Close box" onClick={() => setOpen(false)}>✕</button>
        </div>
        <ul className="drawer__items">
          {rows.length === 0 && <li className="drawer__empty">Nothing in here yet. The shelf is waiting.</li>}
          {rows.map(([id, qty]) => {
            const p = byId(id)!;
            return (
              <li key={id} className="drawer__row">
                <span>{p.name}<br /><small>{money(p.price * qty)}</small></span>
                <span className="qty">
                  <button type="button" aria-label={`Remove one ${p.name}`} onClick={() => change(id, -1)}>−</button>
                  <span>{qty}</span>
                  <button type="button" aria-label={`Add one ${p.name}`} onClick={() => change(id, 1)}>+</button>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="drawer__foot">
          <p className="drawer__total"><span>Total</span><strong>{money(total)}</strong></p>
          <Link
            className={`btn${count === 0 ? " is-disabled" : ""}`}
            aria-disabled={count === 0}
            href="/contact?from=box#orderForm"
            onClick={() => setOpen(false)}
          >
            Preorder this box
          </Link>
        </div>
      </aside>
    </>
  );
}
