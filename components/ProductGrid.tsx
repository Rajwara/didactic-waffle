import ProductCard from "./ProductCard";
import type { Product } from "@/lib/site";

export default function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid">
      {items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
    </div>
  );
}
