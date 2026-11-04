"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { byId } from "@/lib/site";
import { store } from "@/lib/motion";

type Cart = Record<string, number>;
type CartCtx = {
  cart: Cart;
  count: number;
  total: number;
  bump: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (id: string, n?: number) => void;
  change: (id: string, delta: number) => void;
};

const KEY = "didacticWaffleBox";
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(store.get("localStorage", KEY) || "{}") as Cart;
      const clean: Cart = {};
      Object.entries(saved).forEach(([id, q]) => { if (byId(id) && q > 0) clean[id] = q; });
      setCart(clean);
    } catch { /* ignore a damaged saved box */ }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) store.set("localStorage", KEY, JSON.stringify(cart));
  }, [cart]);

  const add = useCallback((id: string, n = 1) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + n }));
    setBump((b) => b + 1);
  }, []);

  const change = useCallback((id: string, delta: number) => {
    setCart((c) => {
      const q = (c[id] || 0) + delta;
      const next = { ...c };
      if (q > 0) next[id] = q; else delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(() => {
    let count = 0, total = 0;
    Object.entries(cart).forEach(([id, q]) => {
      const p = byId(id);
      if (!p) return;
      count += q; total += q * p.price;
    });
    return { cart, count, total, bump, open, setOpen, add, change };
  }, [cart, bump, open, add, change]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
