"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";

export default function AddButton({ id, label, qty = 1, className = "" }: { id: string; label: string; qty?: number; className?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      className={`${className}${added ? " is-added" : ""}`}
      aria-label={`Add ${label} to box`}
      onClick={() => {
        add(id, qty);
        setAdded(true);
        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAdded(false), 1100);
      }}
    >
      <span>{added ? "Added ✓" : "Add to box"}</span>
    </button>
  );
}
