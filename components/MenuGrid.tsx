"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { products, type Category } from "@/lib/site";

const FILTERS: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "bread", label: "Bread" },
  { key: "pastry", label: "Pastry" },
  { key: "sweet", label: "Sweet" },
];

export default function MenuGrid() {
  const [filter, setFilter] = useState<"all" | Category>("all");
  return (
    <>
      <div className="filters reveal" role="group" aria-label="Filter products">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={filter === f.key ? "is-active" : ""}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid">
        {products.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} hidden={filter !== "all" && p.cat !== filter} />
        ))}
      </div>
    </>
  );
}
