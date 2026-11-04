"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { byId } from "@/lib/site";

/* Preorder form: front-end only. Connect it to your form service in onSubmit. */
export default function OrderForm() {
  const { cart } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const orderRef = useRef<HTMLTextAreaElement>(null);
  const [msg, setMsg] = useState("");

  // Coming from "Preorder this box": fill the order field from the box
  useEffect(() => {
    if (new URLSearchParams(location.search).get("from") !== "box" || !orderRef.current) return;
    const lines = Object.entries(cart).map(([id, q]) => `${q} x ${byId(id)?.name}`).filter((l) => !l.endsWith("undefined"));
    if (lines.length) orderRef.current.value = lines.join("\n");
  }, [cart]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current!;
    let firstBad: HTMLInputElement | HTMLTextAreaElement | null = null;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((f) => {
      const bad = !f.checkValidity();
      f.setAttribute("aria-invalid", String(bad));
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      setMsg("Please check the highlighted fields.");
      (firstBad as HTMLElement).focus();
      return;
    }
    setMsg("Demo only: this form is not connected yet, so nothing was sent.");
    form.reset();
    form.querySelectorAll("[aria-invalid]").forEach((f) => f.removeAttribute("aria-invalid"));
  };

  return (
    <form className="order reveal" id="orderForm" noValidate ref={formRef} onSubmit={onSubmit}>
      <h2>Preorder for tomorrow</h2>
      <label>Name<input name="name" type="text" autoComplete="name" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Your order<textarea name="order" ref={orderRef} rows={4} required placeholder="Two country loaves, one rye..." /></label>
      <button className="btn" type="submit"><span>Hold my box</span></button>
      <p className="order__msg" role="status">{msg}</p>
    </form>
  );
}
