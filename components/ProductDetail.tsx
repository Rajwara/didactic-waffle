"use client";

import Link from "next/link";
import { useState } from "react";
import ImageSlot from "./ImageSlot";
import AddButton from "./AddButton";
import { money, type Product } from "@/lib/site";

export default function ProductDetail({ p }: { p: Product }) {
  const [qty, setQty] = useState(1);
  return (
    <section className="detail" data-theme-section="day">
      <ImageSlot className="detail__img" src={p.img} alt={p.name} width={1200} height={1200} priority />
      <div className="detail__info">
        <p className="crumbs reveal"><Link href="/menu">Menu</Link> / {p.cat[0].toUpperCase() + p.cat.slice(1)}</p>
        <h1 className="detail__title"><span className="line is-in"><span>{p.name}</span></span></h1>
        <p className="detail__note reveal">{p.note}</p>
        <p className="detail__price reveal">{money(p.price)}</p>
        <p className="reveal">{p.about}</p>
        <div className="detail__buy reveal">
          <div className="qty qty--big" role="group" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>+</button>
          </div>
          <AddButton id={p.id} label={p.name} qty={qty} className="btn" />
        </div>
      </div>
    </section>
  );
}
